/**
 * Copia de Vercel Blob a R2 los casos cuyo link de descarga sigue vigente.
 *
 * Recorre los manifests recientes, copia cada archivo que referencian a la misma clave
 * en R2 y reescribe el manifest de `{ name, url }` a `{ name, key }`. Como el manifest
 * conserva su pathname, los links ya enviados por mail siguen funcionando.
 * Es idempotente: lo que ya existe en R2 se saltea.
 *
 * Uso (por defecto es simulacro, no escribe nada):
 *   node --env-file=.env.local scripts/migrate-blob-to-r2.mts            # simulacro
 *   node --env-file=.env.local scripts/migrate-blob-to-r2.mts --apply    # copia
 *   node --env-file=.env.local scripts/migrate-blob-to-r2.mts --days=8 --apply
 *
 * Requiere BLOB_READ_WRITE_TOKEN y R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.
 */
import { Readable } from "node:stream"

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { get, list, type ListBlobResultBlob } from "@vercel/blob"

const PREFIX = "ya-soy-usuario/"
const MANIFEST_PREFIX = `${PREFIX}manifests/`

const args = process.argv.slice(2)
const apply = args.includes("--apply")
const days = Number(args.find((arg) => arg.startsWith("--days="))?.split("=")[1] ?? 8)

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`Falta ${name}.`)
  return value
}

const bucket = requireEnv("R2_BUCKET")
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

type LegacyFile = { name: string; url?: string; key?: string }
type LegacyManifest = { sections: { files: LegacyFile[] }[] } & Record<string, unknown>

const listAllBlobs = async () => {
  const blobs: ListBlobResultBlob[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix: PREFIX, cursor })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return blobs
}

const existsInR2 = async (key: string) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch {
    return false
  }
}

const readBlob = async (url: string) => {
  const result = await get(url, { access: "private", useCache: false })
  if (!result || result.statusCode !== 200 || !result.stream) {
    throw new Error(`No se pudo leer ${url}`)
  }
  return result
}

const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const main = async () => {
  const blobs = await listAllBlobs()
  const byUrl = new Map(blobs.map((blob) => [blob.url, blob]))
  const byPathname = new Map(blobs.map((blob) => [blob.pathname, blob]))
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  const manifests = blobs.filter(
    (blob) => blob.pathname.startsWith(MANIFEST_PREFIX) && blob.uploadedAt.getTime() >= cutoff
  )

  console.log(`Blobs en Vercel: ${blobs.length} (${formatMb(blobs.reduce((t, b) => t + b.size, 0))})`)
  console.log(`Manifests de los ultimos ${days} dias: ${manifests.length}`)
  console.log(apply ? "Modo: COPIA" : "Modo: SIMULACRO (usar --apply para copiar)")

  let copiedFiles = 0
  let copiedBytes = 0
  let skippedFiles = 0
  const missing: string[] = []

  for (const manifestBlob of manifests) {
    const manifestResult = await readBlob(manifestBlob.url)
    const manifest = (await new Response(manifestResult.stream).json()) as LegacyManifest

    for (const section of manifest.sections) {
      section.files = section.files.map((file) => {
        if (file.key) return file

        const blob = file.url ? byUrl.get(file.url) : undefined
        if (!blob) {
          missing.push(`${manifestBlob.pathname} -> ${file.name}`)
          return { name: file.name, key: decodeURIComponent(new URL(file.url ?? "").pathname.slice(1)) }
        }
        return { name: file.name, key: blob.pathname }
      })
    }

    for (const file of manifest.sections.flatMap((section) => section.files)) {
      const blob = file.key ? byPathname.get(file.key) : undefined
      if (!blob) continue

      if (await existsInR2(blob.pathname)) {
        skippedFiles += 1
        continue
      }

      copiedFiles += 1
      copiedBytes += blob.size

      if (!apply) continue

      const source = await readBlob(blob.url)
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: blob.pathname,
          Body: Readable.fromWeb(source.stream as import("node:stream/web").ReadableStream),
          ContentLength: blob.size,
          ContentType: source.blob.contentType || "application/octet-stream",
        })
      )
      console.log(`  copiado ${blob.pathname} (${formatMb(blob.size)})`)
    }

    if (apply) {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: manifestBlob.pathname,
          Body: JSON.stringify(manifest),
          ContentType: "application/json",
        })
      )
      console.log(`manifest ${manifestBlob.pathname} listo`)
    }
  }

  console.log("---")
  console.log(`${apply ? "Copiados" : "A copiar"}: ${copiedFiles} archivo(s), ${formatMb(copiedBytes)}`)
  console.log(`Ya existian en R2: ${skippedFiles}`)
  if (missing.length > 0) {
    console.log(`Archivos referenciados que ya no estan en Vercel Blob (${missing.length}):`)
    missing.forEach((line) => console.log(`  ${line}`))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

/**
 * Almacenamiento de archivos en Cloudflare R2 a traves de su API compatible con S3.
 * Cambiar de proveedor S3 (B2, MinIO, S3) es cambiar el endpoint y las credenciales.
 */

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Falta configurar ${name}.`)
  }
  return value
}

let client: S3Client | undefined

const getClient = () => {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
    // Las URLs firmadas no deben exigir un checksum que el navegador no envia.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  })
  return client
}

const getBucket = () => requireEnv("R2_BUCKET")

const UPLOAD_URL_TTL_SECONDS = 60 * 60
const DOWNLOAD_URL_TTL_SECONDS = 10 * 60

/** URL firmada para que el navegador suba un archivo con PUT, atada a su tipo y tamano exactos. */
export const createUploadUrl = (key: string, contentType: string, sizeBytes: number) =>
  getSignedUrl(
    getClient(),
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      ContentType: contentType,
      ContentLength: sizeBytes,
    }),
    {
      expiresIn: UPLOAD_URL_TTL_SECONDS,
      signableHeaders: new Set(["content-type", "content-length"]),
    }
  )

/** URL firmada de corta vida que descarga el archivo directo desde el bucket. */
export const createDownloadUrl = (key: string, contentDisposition: string) =>
  getSignedUrl(
    getClient(),
    new GetObjectCommand({
      Bucket: getBucket(),
      Key: key,
      ResponseContentDisposition: contentDisposition,
    }),
    { expiresIn: DOWNLOAD_URL_TTL_SECONDS }
  )

export const putObject = async (key: string, body: string | Uint8Array, contentType: string) => {
  await getClient().send(
    new PutObjectCommand({ Bucket: getBucket(), Key: key, Body: body, ContentType: contentType })
  )
}

export const getObjectBytes = async (key: string) => {
  const result = await getClient().send(new GetObjectCommand({ Bucket: getBucket(), Key: key }))

  if (!result.Body) {
    throw new Error(`No se encontro el archivo ${key}.`)
  }

  return result.Body.transformToByteArray()
}

export const getObjectText = async (key: string) => {
  const result = await getClient().send(new GetObjectCommand({ Bucket: getBucket(), Key: key }))

  if (!result.Body) {
    throw new Error(`No se encontro el archivo ${key}.`)
  }

  return result.Body.transformToString()
}

export type StoredObject = {
  key: string
  size: number
  uploadedAt: Date
}

export const listObjects = async ({ prefix, cursor }: { prefix: string; cursor?: string }) => {
  const page = await getClient().send(
    new ListObjectsV2Command({ Bucket: getBucket(), Prefix: prefix, ContinuationToken: cursor })
  )

  const objects: StoredObject[] = (page.Contents ?? []).flatMap((item) =>
    item.Key && item.LastModified
      ? [{ key: item.Key, size: item.Size ?? 0, uploadedAt: item.LastModified }]
      : []
  )

  return {
    objects,
    cursor: page.NextContinuationToken,
    hasMore: Boolean(page.IsTruncated),
  }
}

/** Borra en lotes de 1000, el maximo que acepta DeleteObjects. */
export const deleteObjects = async (keys: string[]) => {
  for (let start = 0; start < keys.length; start += 1000) {
    const batch = keys.slice(start, start + 1000)
    const result = await getClient().send(
      new DeleteObjectsCommand({
        Bucket: getBucket(),
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      })
    )

    if (result.Errors && result.Errors.length > 0) {
      throw new Error(`No se pudieron borrar ${result.Errors.length} archivo(s).`)
    }
  }
}

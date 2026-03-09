import { get, put } from "@vercel/blob"
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"

import { yaSoyUsuarioFileSections } from "@/lib/forms/ya-soy-usuario-schema"

type UploadedFile = { name: string; url: string }

export type YaSoyUsuarioManifestSection = {
  key: (typeof yaSoyUsuarioFileSections)[number]["key"]
  label: string
  files: UploadedFile[]
}

export type YaSoyUsuarioManifest = {
  professionalFullName: string
  patientFullName: string
  createdAt: string
  sections: YaSoyUsuarioManifestSection[]
}

type DownloadTokenPayload = {
  manifestPath: string
  exp: number
}

const base64UrlEncode = (value: string) => Buffer.from(value).toString("base64url")
const base64UrlDecode = (value: string) => Buffer.from(value, "base64url").toString("utf8")

const getDownloadSecret = () => {
  const secret = process.env.YA_SOY_USUARIO_DOWNLOAD_SECRET ?? process.env.BLOB_READ_WRITE_TOKEN

  if (!secret) {
    throw new Error("Falta configurar YA_SOY_USUARIO_DOWNLOAD_SECRET o BLOB_READ_WRITE_TOKEN.")
  }

  return secret
}

const signValue = (value: string) => createHmac("sha256", getDownloadSecret()).update(value).digest("base64url")

export const createYaSoyUsuarioManifest = async (manifest: YaSoyUsuarioManifest) => {
  const pathname = `ya-soy-usuario/manifests/${Date.now()}-${randomUUID()}.json`

  return put(pathname, JSON.stringify(manifest), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  })
}

export const createYaSoyUsuarioDownloadToken = (manifestPath: string, expiresInHours = 168) => {
  const payload: DownloadTokenPayload = {
    manifestPath,
    exp: Date.now() + expiresInHours * 60 * 60 * 1000,
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = signValue(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export const verifyYaSoyUsuarioDownloadToken = (token: string) => {
  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) {
    throw new Error("Link invalido.")
  }

  const expectedSignature = signValue(encodedPayload)
  const providedSignature = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  if (
    providedSignature.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(providedSignature, expectedSignatureBuffer)
  ) {
    throw new Error("Link invalido.")
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as DownloadTokenPayload

  if (!payload.manifestPath || typeof payload.exp !== "number") {
    throw new Error("Link invalido.")
  }

  if (payload.exp < Date.now()) {
    throw new Error("El link de descarga vencio.")
  }

  return payload
}

export const getYaSoyUsuarioManifest = async (manifestPath: string) => {
  const result = await get(manifestPath, { access: "private", useCache: false })

  if (!result || result.statusCode !== 200) {
    throw new Error("No pudimos recuperar los archivos del caso.")
  }

  return (await new Response(result.stream).json()) as YaSoyUsuarioManifest
}

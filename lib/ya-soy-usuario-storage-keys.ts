import { randomUUID } from "node:crypto"

import {
  yaSoyUsuarioFileConstraints,
  type YaSoyUsuarioFileFieldName,
} from "@/lib/forms/ya-soy-usuario-file-constraints"

export const YA_SOY_USUARIO_STORAGE_PREFIX = "ya-soy-usuario/"

export const isYaSoyUsuarioFileSection = (value: unknown): value is YaSoyUsuarioFileFieldName =>
  typeof value === "string" && Object.hasOwn(yaSoyUsuarioFileConstraints, value)

const sanitizeKeySegment = (fileName: string) => {
  const cleaned = fileName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120)

  return cleaned.length > 0 ? cleaned : "archivo"
}

/** La clave la decide el servidor: el cliente solo elige seccion y nombre visible. */
export const buildYaSoyUsuarioUploadKey = (section: YaSoyUsuarioFileFieldName, fileName: string) =>
  `${YA_SOY_USUARIO_STORAGE_PREFIX}${section}/${Date.now()}-${randomUUID()}-${sanitizeKeySegment(fileName)}`

/** Las claves llegan del navegador al enviar el formulario: solo aceptamos las de su propia seccion. */
export const isYaSoyUsuarioKeyForSection = (key: unknown, section: YaSoyUsuarioFileFieldName) =>
  typeof key === "string" &&
  key.startsWith(`${YA_SOY_USUARIO_STORAGE_PREFIX}${section}/`) &&
  !key.includes("..")

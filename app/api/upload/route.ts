import { NextRequest, NextResponse } from "next/server"

import { yaSoyUsuarioFileConstraints } from "@/lib/forms/ya-soy-usuario-file-constraints"
import { createUploadUrl } from "@/lib/storage"
import {
  buildYaSoyUsuarioUploadKey,
  isYaSoyUsuarioFileSection,
} from "@/lib/ya-soy-usuario-storage-keys"

type UploadRequest = {
  section?: unknown
  fileName?: unknown
  contentType?: unknown
  size?: unknown
}

export async function POST(req: NextRequest) {
  try {
    const { section, fileName, contentType, size } = (await req.json()) as UploadRequest

    if (!isYaSoyUsuarioFileSection(section)) {
      return NextResponse.json({ error: "Seccion invalida." }, { status: 400 })
    }

    if (typeof fileName !== "string" || typeof contentType !== "string") {
      return NextResponse.json({ error: "Archivo invalido." }, { status: 400 })
    }

    const constraints = yaSoyUsuarioFileConstraints[section]

    if (typeof size !== "number" || !Number.isInteger(size) || size <= 0 || size > constraints.maxSizeBytes) {
      return NextResponse.json(
        { error: `Cada archivo debe pesar hasta ${constraints.maxSizeLabel}.` },
        { status: 400 }
      )
    }

    const key = buildYaSoyUsuarioUploadKey(section, fileName)
    const uploadUrl = await createUploadUrl(key, contentType || "application/octet-stream", size)

    return NextResponse.json({ key, uploadUrl })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir archivo." },
      { status: 500 }
    )
  }
}

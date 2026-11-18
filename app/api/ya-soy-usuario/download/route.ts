import { NextRequest, NextResponse } from "next/server"
import { makeZip } from "client-zip"

import { createDownloadUrl, getObjectStream } from "@/lib/storage"
import {
  getYaSoyUsuarioManifest,
  verifyYaSoyUsuarioDownloadToken,
  type YaSoyUsuarioManifestSection,
} from "@/lib/ya-soy-usuario-downloads"

/** Un ZIP de un caso grande puede tardar lo que tarde la conexion del que descarga. */
export const maxDuration = 300

const buildContentDisposition = (filename: string) => {
  const sanitizedFilename = filename.replace(/[\r\n"]/g, "_")
  return `attachment; filename="${sanitizedFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
}

const sanitizeFileName = (filename: string, fallback: string) => {
  const trimmed = filename.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

/**
 * Arma el ZIP en streaming: cada archivo se abre en R2 recien cuando le toca y se reenvia
 * de a pedazos, asi la memoria no depende del tamano del caso.
 */
const zipResponse = (sections: YaSoyUsuarioManifestSection[], filename: string, withFolders: boolean) => {
  async function* entries() {
    for (const section of sections) {
      for (const [index, file] of section.files.entries()) {
        const name = sanitizeFileName(file.name, `${section.key}-${index + 1}`)
        const object = await getObjectStream(file.key)

        yield {
          name: withFolders ? `${section.label}/${name}` : name,
          input: object.stream,
          size: object.size,
          lastModified: object.lastModified,
        }
      }
    }
  }

  return new NextResponse(makeZip(entries()), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": buildContentDisposition(filename),
      "Cache-Control": "private, no-store, max-age=0",
    },
  })
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now()

  try {
    const token = req.nextUrl.searchParams.get("token")
    const sectionKey = req.nextUrl.searchParams.get("section")
    const fileIndexValue = req.nextUrl.searchParams.get("file")

    console.info("[ya-soy-usuario/download] start", {
      sectionKey: sectionKey ?? "all",
      fileIndex: fileIndexValue ?? null,
    })

    if (!token) {
      return NextResponse.json({ error: "Parametros invalidos." }, { status: 400 })
    }

    const { manifestPath } = verifyYaSoyUsuarioDownloadToken(token)
    const manifest = await getYaSoyUsuarioManifest(manifestPath)

    if (!sectionKey) {
      return zipResponse(manifest.sections, `caso-${manifest.patientFullName || "archivos"}.zip`, true)
    }

    const section = manifest.sections.find((item) => item.key === sectionKey)

    if (!section) {
      return NextResponse.json({ error: "Seccion no encontrada." }, { status: 404 })
    }

    if (fileIndexValue === null) {
      if (section.files.length === 0) {
        return NextResponse.json({ error: "La seccion no tiene archivos." }, { status: 404 })
      }

      return zipResponse([section], `${section.key}.zip`, false)
    }

    const fileIndex = Number(fileIndexValue)
    if (!Number.isInteger(fileIndex) || fileIndex < 0) {
      return NextResponse.json({ error: "Archivo invalido." }, { status: 400 })
    }

    const file = section.files[fileIndex]

    if (!file) {
      return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 })
    }

    // El archivo baja directo del bucket: no pasa por la funcion ni consume su ancho de banda.
    const downloadUrl = await createDownloadUrl(file.key, buildContentDisposition(file.name))

    console.info("[ya-soy-usuario/download] redirect-file", {
      sectionKey,
      fileIndex,
      fileName: file.name,
      durationMs: Date.now() - startedAt,
    })

    return NextResponse.redirect(downloadUrl, {
      status: 302,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    })
  } catch (error) {
    console.error("[ya-soy-usuario/download] error", {
      message: error instanceof Error ? error.message : "Unknown error",
      durationMs: Date.now() - startedAt,
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No pudimos descargar el archivo." },
      { status: 400 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"

import { createDownloadUrl, getObjectBytes } from "@/lib/storage"
import {
  getYaSoyUsuarioManifest,
  verifyYaSoyUsuarioDownloadToken,
  type YaSoyUsuarioManifestSection,
} from "@/lib/ya-soy-usuario-downloads"

const buildContentDisposition = (filename: string) => {
  const sanitizedFilename = filename.replace(/[\r\n"]/g, "_")
  return `attachment; filename="${sanitizedFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
}

const sanitizeFileName = (filename: string, fallback: string) => {
  const trimmed = filename.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const addSectionToZip = async (zip: JSZip, section: YaSoyUsuarioManifestSection) => {
  for (const [index, file] of section.files.entries()) {
    const bytes = await getObjectBytes(file.key).catch(() => {
      throw new Error(`No pudimos descargar ${file.name}.`)
    })
    zip.file(sanitizeFileName(file.name, `${section.key}-${index + 1}`), bytes)
  }
}

const zipResponse = async (zip: JSZip, filename: string) => {
  const content = await zip.generateAsync({ type: "nodebuffer" })
  const body = new Uint8Array(content)

  return {
    bytes: body.byteLength,
    response: new NextResponse(body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": buildContentDisposition(filename),
        "Cache-Control": "private, no-store, max-age=0",
      },
    }),
  }
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
      const zip = new JSZip()

      for (const section of manifest.sections) {
        if (section.files.length === 0) continue

        const folder = zip.folder(section.label)
        if (!folder) continue

        await addSectionToZip(folder, section)
      }

      const { bytes, response } = await zipResponse(zip, `caso-${manifest.patientFullName || "archivos"}.zip`)

      console.info("[ya-soy-usuario/download] complete-case", {
        sections: manifest.sections.length,
        bytes,
        durationMs: Date.now() - startedAt,
      })

      return response
    }

    const section = manifest.sections.find((item) => item.key === sectionKey)

    if (!section) {
      return NextResponse.json({ error: "Seccion no encontrada." }, { status: 404 })
    }

    if (fileIndexValue === null) {
      if (section.files.length === 0) {
        return NextResponse.json({ error: "La seccion no tiene archivos." }, { status: 404 })
      }

      const zip = new JSZip()
      await addSectionToZip(zip, section)

      const { bytes, response } = await zipResponse(zip, `${section.key}.zip`)

      console.info("[ya-soy-usuario/download] complete-section", {
        sectionKey,
        files: section.files.length,
        bytes,
        durationMs: Date.now() - startedAt,
      })

      return response
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

import { NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"
import JSZip from "jszip"

import {
  getYaSoyUsuarioManifest,
  verifyYaSoyUsuarioDownloadToken,
} from "@/lib/ya-soy-usuario-downloads"

const buildContentDisposition = (filename: string) => {
  const sanitizedFilename = filename.replace(/[\r\n"]/g, "_")
  return `attachment; filename="${sanitizedFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
}

const sanitizeFileName = (filename: string, fallback: string) => {
  const trimmed = filename.trim()
  return trimmed.length > 0 ? trimmed : fallback
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

        for (const [index, file] of section.files.entries()) {
          const blob = await get(file.url, { access: "private", useCache: false })

          if (!blob || blob.statusCode !== 200) {
            return NextResponse.json({ error: `No pudimos descargar ${file.name}.` }, { status: 404 })
          }

          const arrayBuffer = await new Response(blob.stream).arrayBuffer()
          const fallbackName = `${section.key}-${index + 1}`
          folder.file(sanitizeFileName(file.name, fallbackName), arrayBuffer)
        }
      }

      const content = await zip.generateAsync({ type: "nodebuffer" })
      const body = new Uint8Array(content)
      const zipFilename = `caso-${manifest.patientFullName || "archivos"}.zip`

      console.info("[ya-soy-usuario/download] complete-case", {
        sections: manifest.sections.length,
        bytes: body.byteLength,
        durationMs: Date.now() - startedAt,
      })

      return new NextResponse(body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": buildContentDisposition(zipFilename),
          "Cache-Control": "private, no-store, max-age=0",
        },
      })
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

      for (const [index, file] of section.files.entries()) {
        const blob = await get(file.url, { access: "private", useCache: false })

        if (!blob || blob.statusCode !== 200) {
          return NextResponse.json({ error: `No pudimos descargar ${file.name}.` }, { status: 404 })
        }

        const arrayBuffer = await new Response(blob.stream).arrayBuffer()
        const fallbackName = `${section.key}-${index + 1}`
        zip.file(sanitizeFileName(file.name, fallbackName), arrayBuffer)
      }

      const content = await zip.generateAsync({ type: "nodebuffer" })
      const body = new Uint8Array(content)
      const zipFilename = `${section.key}.zip`

      console.info("[ya-soy-usuario/download] complete-section", {
        sectionKey,
        files: section.files.length,
        bytes: body.byteLength,
        durationMs: Date.now() - startedAt,
      })

      return new NextResponse(body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": buildContentDisposition(zipFilename),
          "Cache-Control": "private, no-store, max-age=0",
        },
      })
    }

    const fileIndex = Number(fileIndexValue)
    if (!Number.isInteger(fileIndex) || fileIndex < 0) {
      return NextResponse.json({ error: "Archivo invalido." }, { status: 400 })
    }

    const file = section.files[fileIndex]

    if (!file) {
      return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 })
    }

    const blob = await get(file.url, { access: "private", useCache: false })

    if (!blob || blob.statusCode !== 200) {
      return NextResponse.json({ error: "No pudimos descargar el archivo." }, { status: 404 })
    }

    console.info("[ya-soy-usuario/download] complete-file", {
      sectionKey,
      fileIndex,
      fileName: file.name,
      durationMs: Date.now() - startedAt,
    })

    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType || "application/octet-stream",
        "Content-Disposition": buildContentDisposition(file.name),
        "Cache-Control": "private, no-store, max-age=0",
      },
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

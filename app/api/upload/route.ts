import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files").filter((v): v is File => v instanceof File)
    const section = formData.get("section")?.toString() ?? "archivo"

    if (files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos." }, { status: 400 })
    }

    const uploaded = await Promise.all(
      files.map(async (file, index) => {
        const safeName = file.name && file.name.trim().length > 0
          ? file.name
          : `${section}-${index + 1}`

        const blob = await put(`ya-soy-usuario/${section}/${Date.now()}-${safeName}`, file, {
          access: "public",
          addRandomSuffix: true,
        })

        return { name: safeName, url: blob.url }
      })
    )

    return NextResponse.json({ files: uploaded })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir archivos." },
      { status: 500 }
    )
  }
}

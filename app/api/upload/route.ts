import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextRequest, NextResponse } from "next/server"

import { YA_SOY_USUARIO_MAX_UPLOAD_SIZE_BYTES } from "@/lib/forms/ya-soy-usuario-file-constraints"

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: undefined,
          maximumSizeInBytes: YA_SOY_USUARIO_MAX_UPLOAD_SIZE_BYTES,
        }
      },
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir archivo." },
      { status: 500 }
    )
  }
}

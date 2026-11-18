/**
 * Subida de los archivos del caso desde el navegador: pide una URL firmada por archivo
 * y lo sube directo a R2 con XHR (fetch no informa progreso de subida).
 */

export type UploadedCaseFile = { name: string; key: string }

export type UploadProgress = { loadedBytes: number; totalBytes: number }

const CONNECTION_ERROR = (name: string) =>
  `Se cortó la conexión mientras subíamos "${name}". Revisá tu internet y volvé a intentar.`

const requestUploadUrl = async (section: string, name: string, file: File, contentType: string) => {
  let response: Response
  try {
    response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, fileName: name, contentType, size: file.size }),
    })
  } catch {
    throw new Error(CONNECTION_ERROR(name))
  }

  const payload = (await response.json().catch(() => null)) as
    | { key?: string; uploadUrl?: string; error?: string }
    | null

  if (!response.ok || !payload?.key || !payload.uploadUrl) {
    throw new Error(payload?.error ? `"${name}": ${payload.error}` : `No pudimos preparar la subida de "${name}". Volvé a intentar.`)
  }

  return { key: payload.key, uploadUrl: payload.uploadUrl }
}

const putWithProgress = (url: string, file: File, contentType: string, name: string, onLoaded: (bytes: number) => void) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", contentType)
    xhr.upload.onprogress = (event) => onLoaded(event.loaded)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onLoaded(file.size)
        resolve()
      } else {
        reject(new Error(`No pudimos subir "${name}" (error ${xhr.status}). Volvé a intentar.`))
      }
    }
    xhr.onerror = () => reject(new Error(CONNECTION_ERROR(name)))
    xhr.onabort = () => reject(new Error(CONNECTION_ERROR(name)))
    xhr.ontimeout = () => reject(new Error(CONNECTION_ERROR(name)))
    xhr.send(file)
  })

/** Sube todas las secciones en paralelo e informa el avance sumando los bytes de todos los archivos. */
export const uploadCaseFiles = async <Section extends string>(
  filesBySection: Record<Section, File[]>,
  onProgress: (progress: UploadProgress) => void
): Promise<Record<Section, UploadedCaseFile[]>> => {
  const entries = Object.entries(filesBySection) as [Section, File[]][]
  const totalBytes = entries.reduce((total, [, files]) => total + files.reduce((sum, file) => sum + file.size, 0), 0)
  const loadedByFile = new Map<File, number>()

  const report = () =>
    onProgress({ loadedBytes: [...loadedByFile.values()].reduce((sum, bytes) => sum + bytes, 0), totalBytes })

  report()

  const results = await Promise.all(
    entries.map(async ([section, files]) => {
      const uploaded = await Promise.all(
        files.map(async (file, index) => {
          const name = file.name.trim().length > 0 ? file.name : `${section}-${index + 1}`
          const contentType = file.type || "application/octet-stream"
          const { key, uploadUrl } = await requestUploadUrl(section, name, file, contentType)

          await putWithProgress(uploadUrl, file, contentType, name, (bytes) => {
            loadedByFile.set(file, bytes)
            report()
          })

          return { name, key }
        })
      )
      return [section, uploaded] as const
    })
  )

  return Object.fromEntries(results) as Record<Section, UploadedCaseFile[]>
}

export const formatMegabytes = (bytes: number) => {
  const megabytes = bytes / (1024 * 1024)
  return megabytes >= 100 ? `${Math.round(megabytes)} MB` : `${megabytes.toFixed(1)} MB`
}

'use client'

import { useState } from 'react'

type DownloadButtonProps = {
  href: string
  idleLabel: string
  loadingLabel?: string
  className?: string
}

const DownloadButton = ({ href, idleLabel, loadingLabel = 'Preparando descarga...', className }: DownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const getFileName = (contentDisposition: string | null) => {
    if (!contentDisposition) return 'descarga'

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1])
    }

    const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
    return asciiMatch?.[1] ?? 'descarga'
  }

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(href)

      if (!response.ok) {
        throw new Error('No pudimos preparar la descarga.')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const fileName = getFileName(response.headers.get('Content-Disposition'))
      const link = document.createElement('a')

      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isLoading} className={className}>
      {isLoading ? loadingLabel : idleLabel}
    </button>
  )
}

export default DownloadButton

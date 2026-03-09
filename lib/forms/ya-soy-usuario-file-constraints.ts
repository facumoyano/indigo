const megabyte = 1024 * 1024
const gigabyte = megabyte * 1024

export const yaSoyUsuarioFileConstraints = {
  facialPhotos: { maxCount: 5, maxSizeBytes: 100 * megabyte, maxSizeLabel: "100 MB" },
  intraoralPhotos: { maxCount: 10, maxSizeBytes: 100 * megabyte, maxSizeLabel: "100 MB" },
  lateralTeleradiography: { maxCount: 1, maxSizeBytes: gigabyte, maxSizeLabel: "1 GB" },
  orthopantomography: { maxCount: 1, maxSizeBytes: 10 * gigabyte, maxSizeLabel: "10 GB" },
  cbct: { maxCount: 1, maxSizeBytes: gigabyte, maxSizeLabel: "1 GB" },
  intraoralScan: { maxCount: 5, maxSizeBytes: gigabyte, maxSizeLabel: "1 GB" },
} as const

export type YaSoyUsuarioFileFieldName = keyof typeof yaSoyUsuarioFileConstraints

export const YA_SOY_USUARIO_MAX_UPLOAD_SIZE_BYTES = Math.max(
  ...Object.values(yaSoyUsuarioFileConstraints).map((constraint) => constraint.maxSizeBytes)
)

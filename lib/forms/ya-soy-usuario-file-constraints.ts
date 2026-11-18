const megabyte = 1024 * 1024
const gigabyte = megabyte * 1024

export const yaSoyUsuarioFileConstraints = {
  facialPhotos: { maxCount: 5, maxSizeBytes: 20 * megabyte, maxSizeLabel: "20 MB" },
  intraoralPhotos: { maxCount: 10, maxSizeBytes: 20 * megabyte, maxSizeLabel: "20 MB" },
  lateralTeleradiography: { maxCount: 1, maxSizeBytes: 50 * megabyte, maxSizeLabel: "50 MB" },
  orthopantomography: { maxCount: 1, maxSizeBytes: 50 * megabyte, maxSizeLabel: "50 MB" },
  cbct: { maxCount: 1, maxSizeBytes: gigabyte, maxSizeLabel: "1 GB" },
  intraoralScan: { maxCount: 5, maxSizeBytes: 200 * megabyte, maxSizeLabel: "200 MB" },
} as const

export type YaSoyUsuarioFileFieldName = keyof typeof yaSoyUsuarioFileConstraints

export const YA_SOY_USUARIO_MAX_UPLOAD_SIZE_BYTES = Math.max(
  ...Object.values(yaSoyUsuarioFileConstraints).map((constraint) => constraint.maxSizeBytes)
)

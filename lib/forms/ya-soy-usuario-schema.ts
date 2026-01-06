import { z } from "zod"

const fileArraySchema = () =>
  z
    .array(z.custom<File>())
    .optional()
    .default([])
    .refine((files) => files.every((file) => file instanceof File || typeof File === 'undefined'), {
      message: 'Archivo inválido.',
    })

export const yaSoyUsuarioFileSections = [
  { key: "facialPhotos", label: "Fotos faciales", zipName: "fotos-faciales" },
  { key: "intraoralPhotos", label: "Fotos intraorales", zipName: "fotos-intraorales" },
  { key: "lateralTeleradiography", label: "Teleradiografía lateral", zipName: "teleradiografia-lateral" },
  { key: "orthopantomography", label: "Ortopantomografía", zipName: "ortopantomografia" },
  { key: "cbct", label: "CBCT", zipName: "cbct" },
  { key: "intraoralScan", label: "Escaneo intraoral", zipName: "escaneo-intraoral" },
] as const

export const yaSoyUsuarioFormSchema = z
  .object({
    professionalFullName: z.string().min(2, {
      message: "Ingresá al menos 2 caracteres.",
    }),
    professionalPhone: z.string().min(6, {
      message: "Ingresá un teléfono válido.",
    }),
    professionalEmail: z.string().email({
      message: "Ingresá un correo válido.",
    }),
    professionalResidence: z.string().min(2, {
      message: "Ingresá tu lugar de residencia.",
    }),
    patientFullName: z.string().min(2, {
      message: "Ingresá al menos 2 caracteres.",
    }),
    patientBirthDay: z.string().regex(/^[0-9]{1,2}$/u, {
      message: "Ingresá el día (DD).",
    }),
    patientBirthMonth: z.string().regex(/^[0-9]{1,2}$/u, {
      message: "Ingresá el mes (MM).",
    }),
    patientBirthYear: z.string().regex(/^[0-9]{4}$/u, {
      message: "Ingresá el año (AAAA).",
    }),
    facialPhotos: fileArraySchema(),
    intraoralPhotos: fileArraySchema(),
    lateralTeleradiography: fileArraySchema(),
    orthopantomography: fileArraySchema(),
    cbct: fileArraySchema(),
    intraoralScan: fileArraySchema(),
    mainReason: z.string().min(5, {
      message: "Contanos el motivo principal de la consulta.",
    }),
    previousTreatments: z
      .enum(["yes", "no"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    jawsToTreat: z
      .enum(["upper", "lower", "both"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    elementsToKeep: z.string().min(1, {
      message: "Indicá los elementos.",
    }),
    midlinePreference: z
      .enum([
        "keep-both",
        "keep-upper",
        "keep-lower",
        "move-upper-right",
        "move-upper-left",
        "move-lower-right",
        "move-lower-left",
      ])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    overjetPreference: z
      .enum(["keep", "increase", "decrease"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    posteriorCrossbite: z
      .enum(["fix", "no-change", "no-crossbite"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    boltonDiscrepancy: z
      .enum([
        "distal-laterals",
        "distal-canines",
        "distribute",
        "lower-stripping",
      ])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    upperCrowdingResolution: z
      .enum(["stripping", "proinclination", "expansion", "distalization", "other"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    upperCrowdingOther: z.string().optional(),
    lowerCrowdingResolution: z
      .enum(["stripping", "proinclination", "expansion", "distalization"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    additionalInfo: z.string().min(5, {
      message: "Completá esta información.",
    }),
    indigoProfessional: z
      .enum([
        "paulina-albar",
        "viviana-polimant",
        "ayelen-oliver",
        "catalina-fey",
      ])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.upperCrowdingResolution === "other" && !data.upperCrowdingOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["upperCrowdingOther"],
        message: "Especificá otra alternativa.",
      })
    }
  })

export type YaSoyUsuarioFormValues = z.infer<typeof yaSoyUsuarioFormSchema>

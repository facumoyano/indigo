import { z } from "zod"

export const contactFormSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Ingresá al menos 2 caracteres.",
    }),
    phone: z.string().min(6, {
      message: "Ingresá un teléfono válido.",
    }),
    email: z.string().email({
      message: "Ingresá un correo válido.",
    }),
    residence: z.string().min(2, {
      message: "Ingresá tu lugar de residencia.",
    }),
    discoverySource: z
      .enum(["social", "referrals", "courses", "other"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    alignerStatus: z
      .enum(["none", "in-office", "companies"])
      .optional()
      .refine((value) => value !== undefined, {
        message: "Seleccioná una opción.",
      }),
    inOfficeSoftware: z.string().optional(),
    companyPartners: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.alignerStatus === "in-office" && !data.inOfficeSoftware?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inOfficeSoftware"],
        message: "Contanos qué software utilizás.",
      })
    }

    if (data.alignerStatus === "companies" && !data.companyPartners?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyPartners"],
        message: "Indicá con qué empresas trabajás.",
      })
    }
  })

export type ContactFormValues = z.infer<typeof contactFormSchema>

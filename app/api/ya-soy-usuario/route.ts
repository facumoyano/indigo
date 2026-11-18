import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"

import {
  yaSoyUsuarioFileSections,
  yaSoyUsuarioFormSchema,
} from "@/lib/forms/ya-soy-usuario-schema"
import {
  boltonOptions,
  crossbiteOptions,
  indigoProfessionalOptions,
  jawsOptions,
  lowerCrowdingOptions,
  midlineOptions,
  overjetOptions,
  upperCrowdingOptions,
  yesNoOptions,
} from "@/lib/forms/options"
import { getRecipientEmail, getResendClient, getSenderEmail, routeEmail } from "@/lib/email/resend"
import { escapeHtml } from "@/lib/utils"
import { getYaSoyUsuarioAutoResponseHtml } from "@/lib/email/templates/ya-soy-usuario-auto-response"
import { sendErrorNotification } from "@/lib/email/error-notification"
import { deleteObjects } from "@/lib/storage"
import {
  createYaSoyUsuarioDownloadToken,
  createYaSoyUsuarioManifest,
  YA_SOY_USUARIO_RETENTION_HOURS,
  type YaSoyUsuarioStoredFile,
} from "@/lib/ya-soy-usuario-downloads"
import { isYaSoyUsuarioKeyForSection } from "@/lib/ya-soy-usuario-storage-keys"

type UploadedFiles = Partial<Record<(typeof yaSoyUsuarioFileSections)[number]["key"], YaSoyUsuarioStoredFile[]>>

const optionLabel = (value: string | undefined, options: { value: string; label: string }[]) => {
  if (!value) return "-"
  return options.find((option) => option.value === value)?.label ?? value
}

const getString = (formData: FormData, key: string) => formData.get(key)?.toString() ?? ""
const getOptional = (formData: FormData, key: string) => {
  const value = formData.get(key)
  if (value === null || value === undefined || value === "") return undefined
  return value.toString()
}

/** Solo acepta archivos con nombre y con una clave de su propia seccion; descarta el resto. */
const parseUploadedFiles = (raw: string): UploadedFiles => {
  const parsed: unknown = JSON.parse(raw || "{}")
  if (!parsed || typeof parsed !== "object") return {}

  const record = parsed as Record<string, unknown>

  return Object.fromEntries(
    yaSoyUsuarioFileSections.map((section) => {
      const files = Array.isArray(record[section.key]) ? (record[section.key] as unknown[]) : []
      const valid = files.flatMap((file) => {
        const { name, key } = (file ?? {}) as { name?: unknown; key?: unknown }
        return typeof name === "string" && isYaSoyUsuarioKeyForSection(key, section.key)
          ? [{ name, key: key as string }]
          : []
      })
      return [section.key, valid]
    })
  )
}

const cleanupStoredFiles = async (uploadedFiles: UploadedFiles, extraKeys: string[] = []) => {
  const keys = [...Object.values(uploadedFiles).flat().map((f) => f.key), ...extraKeys]
  if (keys.length > 0) {
    await deleteObjects(keys).catch(() => {})
  }
}

export async function POST(req: NextRequest) {
  let uploadedFiles: UploadedFiles = {}
  let rawFormData: Record<string, unknown> = {}
  let manifestKey: string | null = null

  try {
    const formData = await req.formData()

    uploadedFiles = parseUploadedFiles(getString(formData, "uploadedFiles"))

    // Capture raw form data for error notifications
    for (const [key, value] of formData.entries()) {
      if (key === "uploadedFiles") continue
      rawFormData[key] = typeof value === "string" ? value : `[File: ${value.name}]`
    }
    rawFormData.uploadedFiles = Object.fromEntries(
      Object.entries(uploadedFiles).map(([k, v]) => [k, v.map((f) => f.name)])
    )

    const parsedData = yaSoyUsuarioFormSchema.parse({
      professionalFullName: getString(formData, "professionalFullName"),
      professionalPhone: getString(formData, "professionalPhone"),
      professionalEmail: getString(formData, "professionalEmail"),
      professionalResidence: getString(formData, "professionalResidence"),
      patientFullName: getString(formData, "patientFullName"),
      patientBirthDay: getString(formData, "patientBirthDay"),
      patientBirthMonth: getString(formData, "patientBirthMonth"),
      patientBirthYear: getString(formData, "patientBirthYear"),
      facialPhotos: [],
      intraoralPhotos: [],
      lateralTeleradiography: [],
      orthopantomography: [],
      cbct: [],
      intraoralScan: [],
      mainReason: getString(formData, "mainReason"),
      previousTreatments: getOptional(formData, "previousTreatments"),
      jawsToTreat: getOptional(formData, "jawsToTreat"),
      elementsToKeep: getString(formData, "elementsToKeep"),
      midlinePreference: getOptional(formData, "midlinePreference"),
      overjetPreference: getOptional(formData, "overjetPreference"),
      posteriorCrossbite: getOptional(formData, "posteriorCrossbite"),
      boltonDiscrepancy: getOptional(formData, "boltonDiscrepancy"),
      upperCrowdingResolution: getOptional(formData, "upperCrowdingResolution"),
      upperCrowdingOther: getString(formData, "upperCrowdingOther"),
      lowerCrowdingResolution: getOptional(formData, "lowerCrowdingResolution"),
      additionalInfo: getString(formData, "additionalInfo"),
      indigoProfessional: getOptional(formData, "indigoProfessional"),
    })

    const resend = getResendClient()
    const to = getRecipientEmail()
    const from = getSenderEmail()
    const replyTo = `${parsedData.professionalFullName} <${parsedData.professionalEmail}>`
    const assignedProfessional = optionLabel(parsedData.indigoProfessional, indigoProfessionalOptions)

    const manifest = await createYaSoyUsuarioManifest({
      professionalFullName: parsedData.professionalFullName,
      patientFullName: parsedData.patientFullName,
      createdAt: new Date().toISOString(),
      sections: yaSoyUsuarioFileSections.map((section) => ({
        key: section.key,
        label: section.label,
        files: uploadedFiles[section.key] ?? [],
      })),
    })
    manifestKey = manifest.pathname

    const downloadToken = createYaSoyUsuarioDownloadToken(manifest.pathname)
    const filesLink = new URL(`/ya-soy-usuario-archivos?token=${encodeURIComponent(downloadToken)}`, req.nextUrl.origin).toString()

    const fileSummary = yaSoyUsuarioFileSections
      .map((section) => {
        const files = uploadedFiles[section.key] ?? []
        if (files.length === 0) {
          return `<li>${section.label}: sin archivos</li>`
        }
        return `<li>${section.label}: ${files.length} archivo(s)</li>`
      })
      .join("")

    const html = `
      <h2>Nuevo registro de caso clínico</h2>
      <h3>Profesional</h3>
      <ul>
        <li><strong>Nombre:</strong> ${escapeHtml(parsedData.professionalFullName)}</li>
        <li><strong>Teléfono:</strong> ${escapeHtml(parsedData.professionalPhone)}</li>
        <li><strong>Correo:</strong> ${escapeHtml(parsedData.professionalEmail)}</li>
        <li><strong>Residencia:</strong> ${escapeHtml(parsedData.professionalResidence)}</li>
      </ul>
      <h3>Paciente</h3>
      <ul>
        <li><strong>Nombre:</strong> ${escapeHtml(parsedData.patientFullName)}</li>
        <li><strong>Fecha de nacimiento:</strong> ${escapeHtml(`${parsedData.patientBirthDay}/${parsedData.patientBirthMonth}/${parsedData.patientBirthYear}`)}</li>
      </ul>
      <h3>Detalles</h3>
      <ul>
        <li><strong>Motivo principal:</strong> ${escapeHtml(parsedData.mainReason)}</li>
        <li><strong>Ortodoncia previa:</strong> ${escapeHtml(optionLabel(parsedData.previousTreatments, yesNoOptions))}</li>
        <li><strong>Maxilares a tratar:</strong> ${escapeHtml(optionLabel(parsedData.jawsToTreat, jawsOptions))}</li>
        <li><strong>Elementos a conservar:</strong> ${escapeHtml(parsedData.elementsToKeep)}</li>
        <li><strong>Línea media:</strong> ${escapeHtml(optionLabel(parsedData.midlinePreference, midlineOptions))}</li>
        <li><strong>Resalte:</strong> ${escapeHtml(optionLabel(parsedData.overjetPreference, overjetOptions))}</li>
        <li><strong>Mordida cruzada:</strong> ${escapeHtml(optionLabel(parsedData.posteriorCrossbite, crossbiteOptions))}</li>
        <li><strong>Discrepancia de Bolton:</strong> ${escapeHtml(optionLabel(parsedData.boltonDiscrepancy, boltonOptions))}</li>
        <li><strong>Apilamiento superior:</strong> ${escapeHtml(optionLabel(parsedData.upperCrowdingResolution, upperCrowdingOptions))}${
          parsedData.upperCrowdingResolution === "other" && parsedData.upperCrowdingOther
            ? ` - ${escapeHtml(parsedData.upperCrowdingOther)}`
            : ""
        }</li>
        <li><strong>Apilamiento inferior:</strong> ${escapeHtml(optionLabel(parsedData.lowerCrowdingResolution, lowerCrowdingOptions))}</li>
        <li><strong>Información adicional:</strong> ${escapeHtml(parsedData.additionalInfo)}</li>
        <li><strong>Profesional Indigo asignado:</strong> ${escapeHtml(assignedProfessional)}</li>
      </ul>
      <h3>Archivos del caso</h3>
      <ul>${fileSummary}</ul>
      <p><a href="${escapeHtml(filesLink)}">Abrir archivos del caso</a></p>
      <p><em>El link estará disponible durante ${YA_SOY_USUARIO_RETENTION_HOURS / 24} días.</em></p>
    `

    const baseSubject = `Nuevo caso clínico - ${assignedProfessional} - ${parsedData.professionalFullName}`

    await resend.emails.send(routeEmail({
      from,
      to,
      replyTo,
      subject: baseSubject,
      html,
    }))

    // Auto-response to the professional
    await resend.emails.send(routeEmail({
      from,
      to: parsedData.professionalEmail,
      replyTo: from,
      subject: `¡Recibimos tu caso correctamente!`,
      html: getYaSoyUsuarioAutoResponseHtml(parsedData.professionalFullName, parsedData.patientFullName),
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    await cleanupStoredFiles(uploadedFiles, manifestKey ? [manifestKey] : [])

    await sendErrorNotification({
      route: "/api/ya-soy-usuario",
      error,
      formData: rawFormData,
    })

    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno al enviar el correo." }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import { ZodError } from "zod"

import {
  yaSoyUsuarioFileSections,
  yaSoyUsuarioFormSchema,
  type YaSoyUsuarioFormValues,
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
import { getRecipientEmail, getResendClient, getSenderEmail } from "@/lib/email/resend"
import { escapeHtml } from "@/lib/utils"
import { getYaSoyUsuarioAutoResponseHtml } from "@/lib/email/templates/ya-soy-usuario-auto-response"

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

const getFiles = (formData: FormData, key: typeof yaSoyUsuarioFileSections[number]["key"]) =>
  formData
    .getAll(key)
    .filter((value): value is File => value instanceof File)

const buildZipAttachments = async (data: YaSoyUsuarioFormValues) => {
  const attachments: { filename: string; content: string }[] = []

  for (const section of yaSoyUsuarioFileSections) {
    const files = data[section.key]
    if (!files || files.length === 0) continue

    const zip = new JSZip()

    for (const [index, file] of files.entries()) {
      const arrayBuffer = await file.arrayBuffer()
      const safeName = file.name && file.name.trim().length > 0 ? file.name : `${section.zipName}-${index + 1}`
      zip.file(safeName, arrayBuffer)
    }

    const content = await zip.generateAsync({ type: "base64" })
    attachments.push({ filename: `${section.zipName}.zip`, content })
  }

  return attachments
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const parsedData = yaSoyUsuarioFormSchema.parse({
      professionalFullName: getString(formData, "professionalFullName"),
      professionalPhone: getString(formData, "professionalPhone"),
      professionalEmail: getString(formData, "professionalEmail"),
      professionalResidence: getString(formData, "professionalResidence"),
      patientFullName: getString(formData, "patientFullName"),
      patientBirthDay: getString(formData, "patientBirthDay"),
      patientBirthMonth: getString(formData, "patientBirthMonth"),
      patientBirthYear: getString(formData, "patientBirthYear"),
      facialPhotos: getFiles(formData, "facialPhotos"),
      intraoralPhotos: getFiles(formData, "intraoralPhotos"),
      lateralTeleradiography: getFiles(formData, "lateralTeleradiography"),
      orthopantomography: getFiles(formData, "orthopantomography"),
      cbct: getFiles(formData, "cbct"),
      intraoralScan: getFiles(formData, "intraoralScan"),
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

    const attachments = await buildZipAttachments(parsedData)
    const resend = getResendClient()
    const to = getRecipientEmail()
    const from = getSenderEmail()
    const replyTo = `${parsedData.professionalFullName} <${parsedData.professionalEmail}>`
    const assignedProfessional = optionLabel(parsedData.indigoProfessional, indigoProfessionalOptions)

    const fileSummary = yaSoyUsuarioFileSections
      .map((section) => {
        const files = parsedData[section.key]
        return `<li>${section.label}: ${files.length} archivo(s) adjuntos (${section.zipName}.zip)</li>`
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
      <h3>Archivos adjuntos</h3>
      <ul>${fileSummary}</ul>
    `

    await resend.emails.send({
      from,
      to,
      replyTo,
      subject: `Nuevo caso clínico - ${assignedProfessional} - ${parsedData.professionalFullName}`,
      html,
      attachments,
    })

    await resend.emails.send({
      from,
      to: parsedData.professionalEmail,
      replyTo: from,
      subject: `¡Recibimos tu caso correctamente!`,
      html: getYaSoyUsuarioAutoResponseHtml(parsedData.professionalFullName, parsedData.patientFullName),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno al enviar el correo." }, { status: 500 })
  }
}

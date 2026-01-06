import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"

import { contactFormSchema } from "@/lib/forms/contact-form-schema"
import { alignerOptions, discoveryOptions } from "@/lib/forms/options"
import { getRecipientEmail, getResendClient, getSenderEmail } from "@/lib/email/resend"
import { getContactAutoResponseHtml } from "@/lib/email/templates/contact-auto-response"
import { escapeHtml } from "@/lib/utils"

const mapOptionLabel = (value: string | undefined, options: { value: string; label: string }[]) => {
  if (!value) return "-"
  return options.find((option) => option.value === value)?.label ?? value
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const data = contactFormSchema.parse(payload)

    const resend = getResendClient()
    const to = getRecipientEmail()
    const from = getSenderEmail()
    const replyTo = `${data.fullName} <${data.email}>`

    const html = `
      <h2>Nuevo formulario de contacto</h2>
      <p><strong>Nombre y apellido:</strong> ${escapeHtml(data.fullName)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Residencia:</strong> ${escapeHtml(data.residence)}</p>
      <p><strong>¿Cómo nos conoció?</strong> ${escapeHtml(mapOptionLabel(data.discoverySource, discoveryOptions))}</p>
      <p><strong>¿Trabaja con alineadores?</strong> ${escapeHtml(mapOptionLabel(data.alignerStatus, alignerOptions))}</p>
      ${data.inOfficeSoftware ? `<p><strong>Software In Office:</strong> ${escapeHtml(data.inOfficeSoftware)}</p>` : ""}
      ${data.companyPartners ? `<p><strong>Empresas con las que trabaja:</strong> ${escapeHtml(data.companyPartners)}</p>` : ""}
    `

    await resend.emails.send({
      from,
      to,
      replyTo,
      subject: "Nuevo formulario de contacto Indigo",
      html,
    })

    await resend.emails.send({
      from,
      to: data.email,
      replyTo: from,
      subject: "Gracias por contactarte con Indigo",
      html: getContactAutoResponseHtml(data.fullName),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno al enviar el correo." }, { status: 500 })
  }
}

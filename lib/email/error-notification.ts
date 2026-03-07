import { getResendClient, getSenderEmail } from "./resend"
import { escapeHtml } from "../utils"

const DEV_EMAIL = "facumoyano44@gmail.com"

export const sendErrorNotification = async ({
  route,
  error,
  formData,
}: {
  route: string
  error: unknown
  formData?: Record<string, unknown>
}) => {
  try {
    const resend = getResendClient()
    const from = getSenderEmail()

    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack ?? "" : ""

    const formDataHtml = formData
      ? Object.entries(formData)
          .map(([key, value]) => {
            const display = typeof value === "string" ? value : JSON.stringify(value)
            return `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(display)}</li>`
          })
          .join("")
      : "<li>No disponible</li>"

    const html = `
      <h2>Error en ${escapeHtml(route)}</h2>
      <p><strong>Fecha:</strong> ${new Date().toISOString()}</p>
      <h3>Error</h3>
      <pre style="background:#f5f5f5;padding:12px;border-radius:4px;overflow-x:auto;">${escapeHtml(errorMessage)}</pre>
      ${errorStack ? `<h3>Stack trace</h3><pre style="background:#f5f5f5;padding:12px;border-radius:4px;overflow-x:auto;font-size:12px;">${escapeHtml(errorStack)}</pre>` : ""}
      <h3>Datos del formulario</h3>
      <ul>${formDataHtml}</ul>
    `

    await resend.emails.send({
      from,
      to: DEV_EMAIL,
      subject: `[Error] ${route} - ${errorMessage.slice(0, 80)}`,
      html,
    })
  } catch {
    // Silently fail - we don't want error notification failures to affect the response
  }
}

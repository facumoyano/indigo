import { escapeHtml } from '@/lib/utils'

const LOGO_URL = 'https://indigo-dun-nine.vercel.app/images/desktop/common/logo.png'

const getShortName = (fullName: string) => {
  const trimmed = fullName?.trim()
  if (!trimmed) return 'Profesional'
  return trimmed.split(/\s+/u)[0] || 'Profesional'
}

export const getYaSoyUsuarioAutoResponseHtml = (fullName: string, patientName: string) => {
  const shortName = escapeHtml(getShortName(fullName))
  const safePatient = escapeHtml(patientName || 'tu paciente')

  return `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Recibimos la información del caso</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6fb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#283047;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6fb;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:32px;padding:32px 40px;box-shadow:0 20px 45px rgba(96,110,182,0.08);">
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <img src="${LOGO_URL}" width="180" alt="Indigo" style="display:block;max-width:200px;width:100%;height:auto;" />
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:16px;">
                  <p style="margin:0;font-size:18px;font-weight:600;color:#1f2559;">¡Hola ${shortName}!,</p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:18px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                    Te confirmamos que recibimos correctamente tu caso. <br> En la brevedad, la Dra. de Indigo® solicitada se pondrá en contacto para continuar con la planificación y el seguimiento correspondiente.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:18px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                    Quedamos a disposición ante cualquier consulta adicional.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                    ¡Gracias por elegirnos! 🙂 
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#7c8198;">
                    Equipo Indigo®
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#7c8198;">
                    Este correo fue enviado automáticamente. Para sumar información al caso o realizar una consulta, podés responder a este mensaje.
                  </p>
                </td>
              </tr>
            </table>
            <p style="margin:24px 0 0;font-size:12px;color:#9aa0ba;">© ${new Date().getFullYear()} Indigo. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </body>
  </html>`
}


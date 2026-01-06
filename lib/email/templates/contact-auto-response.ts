import { escapeHtml } from '@/lib/utils'

const LOGO_URL = 'https://indigo-dun-nine.vercel.app/images/desktop/common/logo.png'

const getShortName = (fullName: string) => {
  const trimmed = fullName?.trim()
  if (!trimmed) return 'Profesional'
  const [firstSegment] = trimmed.split(/\s+/u)
  return firstSegment || 'Profesional'
}

export const getContactAutoResponseHtml = (fullName: string) => {
  const shortName = escapeHtml(getShortName(fullName))

  return `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Gracias por contactarte con Indigo</title>
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
                <td style="padding-bottom:12px;">
                  <p style="margin:0;font-size:18px;font-weight:600;color:#1f2559;">¡Hola ${shortName}!</p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:20px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                    Gracias por escribirnos y por tu interés en Indigo. <br> Ya recibimos tu formulario y un miembro de nuestro equipo se pondrá en contacto a la brevedad  para asesorarte sobre nuestro servicio.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                    En Indigo trabajamos con una metodología 100% personalizada, pensada para cada profesional y cada paciente.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                    Mientras tanto, podés visitar nuestro sitio y conocer más sobre cómo trabajamos y qué hacemos.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#4a4f63;">
                   Estaremos en contacto pronto :) <br> Equipo Indigo®
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#7c8198;">
                    Este correo fue enviado automáticamente. Si necesitás actualizar tus datos o compartir un nuevo caso, podés responder a este mensaje.
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

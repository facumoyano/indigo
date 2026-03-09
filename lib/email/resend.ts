import { Resend } from "resend"

let client: Resend | null = null

export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('Falta configurar RESEND_API_KEY')
  }

  if (!client) {
    client = new Resend(apiKey)
  }

  return client
}

const notificationRecipients = ["odcatalina@sonrisasindigo.com.ar", "odayelen@sonrisasindigo.com.ar", "odviviana@sonrisasindigo.com.ar", "odpaulina@sonrisasindigo.com.ar"]
const indigoSenderEmail = "Indigo <contacto@email.sonrisasindigo.com.ar>"

export const getRecipientEmail = () => notificationRecipients

export const getSenderEmail = () => indigoSenderEmail

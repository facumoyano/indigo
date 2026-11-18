import { createHash, randomBytes } from "node:crypto"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import { expect, test, type Download, type Page } from "@playwright/test"
import JSZip from "jszip"
import { Resend } from "resend"

/**
 * Recorrido completo y real: completa el formulario con archivos, los sube a R2, espera el
 * mail en Resend, abre el link y verifica byte a byte cada descarga.
 * Requiere EMAIL_TEST_RECIPIENT para que los mails no le lleguen a Indigo.
 */

const sha256 = (data: Buffer | Uint8Array) => createHash("sha256").update(data).digest("hex")

const MB = 1024 * 1024

type Fixture = { section: string; name: string; bytes: Buffer }

/** E2E_LARGE=1 simula un caso real pesado (~500 MB) para probar los ZIP en Vercel. */
const cbctSize = process.env.E2E_LARGE === "1" ? 480 * MB : 60 * MB

/** Los Previews de Vercel estan protegidos: este secreto deja pasar a la prueba sin login. */
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const bypassHeaders: Record<string, string> = bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : {}

test.beforeEach(async ({ page }) => {
  if (!bypassSecret) return
  // Deja una cookie de bypass en el dominio del Preview. No usamos un header global porque
  // tambien viajaria en las subidas a R2 y el CORS del bucket lo rechazaria.
  await page.goto(`/?x-vercel-protection-bypass=${bypassSecret}&x-vercel-set-bypass-cookie=true`)
})

const buildFixtures = (): Fixture[] => [
  { section: "facialPhotos", name: "Foto frontal ñandú.jpg", bytes: randomBytes(1 * MB) },
  { section: "facialPhotos", name: "perfil con sonrisa.png", bytes: randomBytes(512 * 1024) },
  { section: "intraoralPhotos", name: "oclusal superior.jpeg", bytes: randomBytes(2 * MB) },
  { section: "orthopantomography", name: "Panorámica (2026).jpg", bytes: randomBytes(3 * MB) },
  { section: "cbct", name: "CBCT paciente final.zip", bytes: randomBytes(cbctSize) },
  { section: "intraoralScan", name: "maxilar superior.stl", bytes: randomBytes(5 * MB) },
]

const sectionLabels: Record<string, string> = {
  facialPhotos: "Fotos faciales",
  intraoralPhotos: "Fotos intraorales",
  orthopantomography: "Ortopantomografía",
  cbct: "CBCT",
  intraoralScan: "Escaneo intraoral",
}

const readDownload = async (download: Download) => readFileSync(await download.path())

const waitForCaseEmail = async (resend: Resend, marker: string) => {
  const deadline = Date.now() + 90 * 1000

  while (Date.now() < deadline) {
    const { data } = await resend.emails.list({ limit: 20 })
    const match = data?.data.find((email) => email.subject.includes(marker) && email.subject.includes("Nuevo caso"))

    if (match) {
      const { data: full } = await resend.emails.get(match.id)
      if (full?.html) return full
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error(`No llego el mail del caso "${marker}" a Resend.`)
}

const fillForm = async (page: Page, marker: string, files: Record<string, string[]>) => {
  await page.locator(`[name="professionalFullName"]`).fill(marker)
  await page.locator(`[name="professionalPhone"]`).fill("1144556677")
  await page.locator(`[name="professionalEmail"]`).fill(process.env.EMAIL_TEST_RECIPIENT!)
  await page.locator(`[name="professionalResidence"]`).fill("CABA")
  await page.locator(`[name="patientFullName"]`).fill("Paciente de prueba E2E")
  await page.locator(`[name="patientBirthDay"]`).fill("15")
  await page.locator(`[name="patientBirthMonth"]`).fill("06")
  await page.locator(`[name="patientBirthYear"]`).fill("1990")
  await page.locator(`[name="mainReason"]`).fill("Prueba automatica de punta a punta.")
  await page.locator(`[name="elementsToKeep"]`).fill("Ninguno, es una prueba.")
  await page.locator(`[name="additionalInfo"]`).fill("Ignorar: caso generado por la prueba E2E.")

  const radioGroups = page.locator("div.space-y-2:has(> label > input[type=radio])")
  const groupCount = await radioGroups.count()
  for (let index = 0; index < groupCount; index++) {
    await radioGroups.nth(index).locator("input[type=radio]").first().check()
  }

  for (const [section, filePaths] of Object.entries(files)) {
    await page.locator(`input[name="${section}"]`).setInputFiles(filePaths)
  }
}

test("el formulario sube los archivos y el link del mail los entrega intactos", async ({ page }) => {
  const testRecipient = process.env.EMAIL_TEST_RECIPIENT
  const resendKey = process.env.RESEND_API_KEY
  test.skip(!testRecipient || !resendKey, "Falta EMAIL_TEST_RECIPIENT o RESEND_API_KEY.")

  const resend = new Resend(resendKey)
  const marker = `Prueba E2E ${Date.now()}`
  const fixtures = buildFixtures()
  const workdir = mkdtempSync(path.join(tmpdir(), "indigo-e2e-"))

  const filesBySection: Record<string, string[]> = {}
  for (const fixture of fixtures) {
    const filePath = path.join(workdir, fixture.section, fixture.name)
    mkdirSync(path.dirname(filePath), { recursive: true })
    writeFileSync(filePath, fixture.bytes)
    ;(filesBySection[fixture.section] ??= []).push(filePath)
  }

  await test.step("completar y enviar el formulario", async () => {
    await page.goto("/ya-soy-usuario-indigo")
    await fillForm(page, marker, filesBySection)
    await page.getByRole("button", { name: "Enviar" }).click()
    const success = page.getByText("¡Gracias! Recibimos la información del caso.")
    const failure = page.locator("p.text-red-500")
    await expect(success.or(failure)).toBeVisible({ timeout: 4 * 60 * 1000 })
    if (await failure.isVisible()) {
      throw new Error(`El formulario mostro un error: ${await failure.textContent()}`)
    }
  })

  const email = await test.step("recibir el mail de Indigo (desviado a la casilla de prueba)", async () => {
    const found = await waitForCaseEmail(resend, marker)
    expect(found.to).toEqual([testRecipient])
    expect(found.subject.startsWith("[PRUEBA]")).toBe(true)
    expect(found.html).toContain("El link estará disponible durante 7 días.")
    return found
  })

  const filesLink = email.html!.match(/href="([^"]*ya-soy-usuario-archivos\?token=[^"]+)"/)?.[1]?.replaceAll("&amp;", "&")
  expect(filesLink, "el mail tiene el link a los archivos").toBeTruthy()

  await test.step("abrir el link y ver todos los archivos", async () => {
    // El link apunta al origen que atendio el envio; lo abrimos tal cual.
    await page.goto(filesLink!)
    await expect(page.getByRole("heading", { name: /Archivos del caso para/ })).toBeVisible()
    await expect(page.getByText(`Archivos disponibles: ${fixtures.length}`)).toBeVisible()
    for (const fixture of fixtures) {
      await expect(page.getByText(fixture.name, { exact: true })).toBeVisible()
    }
  })

  await test.step("descargar cada archivo suelto y comparar el hash", async () => {
    for (const fixture of fixtures) {
      const row = page.locator("li", { hasText: fixture.name })
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        row.getByRole("link", { name: "Descargar archivo" }).click(),
      ])
      expect(download.suggestedFilename()).toBe(fixture.name)
      expect(sha256(await readDownload(download)), fixture.name).toBe(sha256(fixture.bytes))
    }
  })

  await test.step("descargar una seccion como ZIP y comparar el contenido", async () => {
    const section = page.locator("div.rounded-3xl", { has: page.getByRole("heading", { name: "Fotos faciales" }) })
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      section.getByRole("link", { name: "Descargar seccion" }).click(),
    ])
    const zip = await JSZip.loadAsync(await readDownload(download))
    for (const fixture of fixtures.filter((item) => item.section === "facialPhotos")) {
      const entry = zip.file(fixture.name)
      expect(entry, `${fixture.name} dentro del ZIP`).toBeTruthy()
      expect(sha256(await entry!.async("uint8array"))).toBe(sha256(fixture.bytes))
    }
  })

  await test.step("descargar el caso completo como ZIP y comparar el contenido", async () => {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 4 * 60 * 1000 }),
      page.getByRole("link", { name: "Descargar caso completo" }).click(),
    ])
    const zip = await JSZip.loadAsync(await readDownload(download))
    for (const fixture of fixtures) {
      const entry = zip.file(`${sectionLabels[fixture.section]}/${fixture.name}`)
      expect(entry, `${fixture.name} dentro del ZIP completo`).toBeTruthy()
      expect(sha256(await entry!.async("uint8array"))).toBe(sha256(fixture.bytes))
    }
  })

  await test.step("un link alterado no abre nada", async () => {
    const tampered = new URL(filesLink!)
    const token = tampered.searchParams.get("token")!
    tampered.searchParams.set("token", `${token.slice(0, -2)}xx`)
    await page.goto(tampered.toString())
    await expect(page.getByText("Link invalido.")).toBeVisible()
  })
})

test("el servidor rechaza archivos mas grandes que el limite de su seccion", async ({ request }) => {
  const response = await request.post("/api/upload", {
    headers: bypassHeaders,
    data: { section: "facialPhotos", fileName: "enorme.jpg", contentType: "image/jpeg", size: 21 * MB },
  })
  expect(response.status()).toBe(400)
  expect((await response.json()).error).toContain("20 MB")
})

test("el servidor rechaza secciones inventadas", async ({ request }) => {
  const response = await request.post("/api/upload", {
    headers: bypassHeaders,
    data: { section: "manifests", fileName: "x.json", contentType: "application/json", size: 10 },
  })
  expect(response.status()).toBe(400)
})

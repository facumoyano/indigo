import NavbarDesktop from '@/components/navbar-desktop'
import NavbarMobile from '@/components/navbar-mobile'
import DownloadButton from "@/components/download-button"

import {
  getYaSoyUsuarioManifest,
  verifyYaSoyUsuarioDownloadToken,
} from "@/lib/ya-soy-usuario-downloads"

type PageProps = {
  searchParams: Promise<{ token?: string }>
}

const YaSoyUsuarioArchivosPage = async ({ searchParams }: PageProps) => {
  const { token } = await searchParams

  if (!token) {
    return (
      <div>
        <NavbarDesktop />
        <NavbarMobile />
        <main className="max-w-[700px] mx-auto mt-20 md:mt-20 p-4">
          <section className="space-y-6 rounded-4xl border border-gray-300 p-5 md:p-8 text-gray-text">
            <div>
              <h1 className="text-2xl md:text-3xl text-blue-custom">Archivos del caso</h1>
              <div className="h-[1px] bg-blue-custom w-full my-4"></div>
            </div>
            <p className="text-sm md:text-base">Link de descarga invalido.</p>
          </section>
        </main>
      </div>
    )
  }

  try {
    const { manifestPath } = verifyYaSoyUsuarioDownloadToken(token)
    const manifest = await getYaSoyUsuarioManifest(manifestPath)
    const totalFiles = manifest.sections.reduce((total, section) => total + section.files.length, 0)

    return (
      <div>
        <NavbarDesktop />
        <NavbarMobile />
        <main className="max-w-[700px] mx-auto mt-20 md:mt-20 p-4">
          <div className="space-y-6 text-gray-text">
            <div>
              <h1 className="text-2xl md:text-3xl text-blue-custom">
                Archivos del caso para <span className="font-bold">{manifest.patientFullName}</span>
              </h1>
              <div className="h-[1px] bg-blue-custom w-full my-4"></div>
              <div className="space-y-2 text-sm md:text-base">
                <p><span className="font-bold">Profesional:</span> {manifest.professionalFullName}</p>
                <p><span className="font-bold">Archivos disponibles:</span> {totalFiles}</p>
                <p>Desde esta pagina podes descargar el caso completo, una seccion puntual o archivos individuales.</p>
              </div>
            </div>

            <section className="space-y-4 rounded-4xl border border-gray-300 p-5 md:p-8 mb-10">
              <div className="flex flex-col gap-4 rounded-3xl bg-blue-custom/5 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-blue-custom">Descarga completa</p>
                  <p className="text-sm md:text-base">Descarga todos los archivos del caso en un unico .zip.</p>
                </div>
                <DownloadButton
                  href={`/api/ya-soy-usuario/download?token=${encodeURIComponent(token)}`}
                  idleLabel="Descargar caso completo"
                  loadingLabel="Preparando caso completo..."
                  className="inline-flex items-center justify-center rounded-lg border border-blue-custom px-4 py-2 text-sm font-medium text-blue-custom transition-colors hover:bg-blue-custom/10 disabled:opacity-70"
                />
              </div>

              <div className="space-y-4">
                {manifest.sections.map((section) => (
                  <div key={section.key} className="rounded-3xl border border-gray-200 p-4 md:p-5">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <h2 className="text-lg font-bold text-blue-custom">{section.label}</h2>
                        <p className="text-sm md:text-base text-gray-text">
                          {section.files.length === 0 ? 'Sin archivos cargados en esta seccion.' : `${section.files.length} archivo(s) disponible(s).`}
                        </p>
                      </div>
                      {section.files.length > 0 ? (
                        <DownloadButton
                          href={`/api/ya-soy-usuario/download?token=${encodeURIComponent(token)}&section=${section.key}`}
                          idleLabel="Descargar seccion"
                          loadingLabel="Preparando seccion..."
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-text transition-colors hover:bg-gray-100 disabled:opacity-70"
                        />
                      ) : null}
                    </div>

                    {section.files.length === 0 ? null : (
                      <ul className="space-y-2">
                        {section.files.map((file, index) => (
                          <li key={`${section.key}-${file.name}-${index}`} className="flex flex-col gap-3 rounded-2xl bg-gray-100 px-4 py-3 md:flex-row md:items-center md:justify-between">
                            <span className="min-w-0 truncate text-sm md:text-base text-gray-text">{file.name}</span>
                            <DownloadButton
                              href={`/api/ya-soy-usuario/download?token=${encodeURIComponent(token)}&section=${section.key}&file=${index}`}
                              idleLabel="Descargar archivo"
                              loadingLabel="Descargando..."
                              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-text transition-colors hover:bg-white disabled:opacity-70"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos abrir los archivos del caso."

    return (
      <div>
        <NavbarDesktop />
        <NavbarMobile />
        <main className="max-w-[700px] mx-auto mt-20 md:mt-20 p-4">
          <section className="space-y-6 rounded-4xl border border-gray-300 p-5 md:p-8 text-gray-text">
            <div>
              <h1 className="text-2xl md:text-3xl text-blue-custom">Archivos del caso</h1>
              <div className="h-[1px] bg-blue-custom w-full my-4"></div>
            </div>
            <p className="text-sm md:text-base">{message}</p>
          </section>
        </main>
      </div>
    )
  }
}

export default YaSoyUsuarioArchivosPage

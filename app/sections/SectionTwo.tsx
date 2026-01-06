import Image from "next/image"
import { Images } from "../images"
import { WHATSAPP_LINK } from "../constants"
import Link from "next/link"

const SectionTwo = () => {
    return (
        // TODO: Revisar estilos CAMBIAR COLOR BG, CAMBIAR LOS DIENTES POR FOTO CON TEXTO
        <div className="min-h-screen relative bg-[#606eb2] px-4 md:hidden pb-6 z-40">
            <div className="w-full flex flex-col justify-center">
                <div className="relative h-[125px] w-[270px] mx-auto flex items-center justify-center text-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.95] mix-blend-color-burn z-0"
                        style={{
                            backgroundImage: `url(${Images.mobile.sectionTwo.circleCuted})`,
                        }}
                    />
                    <p className="text-[11px] text-light-blue-text text-center z-10 pb-8">
                        <span className="font-bold">Indigo&reg;</span> alineadores invisibles.
                    </p>
                </div>

                <h2 className="text-xl text-center text-white">Alineadores invisibles de <br />
                    <span className="font-bold">ortodoncistas para ortodoncistas.</span>
                </h2>
                <div className="relative w-full mx-auto aspect-[350/300] mt-20">
                    {/* Imagen como fondo para poder usar fill */}
                    <Image
                        src={Images.mobile.sectionTwo.dientes}
                        alt="Dientes"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h3 className="text-xl text-center text-white font-bold mt-6">Tecnología de punta, <br />
                    <span>experiencia y criterio clínico</span>
                </h3>
                <div className="space-y-6 flex flex-col justify-center items-center mt-6">
                    <p className="text-[#a7e6d7] text-center text-sm">
                        Simplificá lo complejo y <br />
                        <span className="font-bold">transformá tu consultorio con</span><br />
                        <span className="font-bold">Ortodoncia Digital ahora.</span>
                    </p>
                    <Link href="/contactar" className="cursor-pointer pt-4 z-50">
                        <Image
                            src={Images.mobile.common.btnContactanosGradient}
                            alt="Contactanos"
                            width={127}
                            height={20}
                        />
                    </Link>
                    <Image
                        src={Images.mobile.sectionTwo.go}
                        alt="Go"
                        width={55}
                        height={36}
                    />

                </div>
                <div
                    className="h-[140px] w-[280px] bg-cover bg-center
             absolute bottom-0 left-1/2 -translate-x-1/2 brightness-[0.95] mix-blend-color-burn z-0"
                    style={{
                        backgroundImage: `url(${Images.mobile.sectionTwo.circleCutedDown})`,
                    }}
                />


            </div>
        </div>
    )
}

export default SectionTwo

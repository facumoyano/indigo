import Image from "next/image"
import { Images } from "../images"

const Hero = () => {
    return (
        // TODO: Revisar estilos
        <div
            className="flex flex-col items-center overflow-x-hidden pt-10 justify-center min-h-screen w-full bg-cover px-4 space-y-8 relative z-10 bg-[url('/images/mobile/hero/bg-hero.png')] md:hidden"

        >
            <span className="text-xs text-light-blue-text text-center pt-10">
                De ortodoncistas{" "}
                <span className="font-bold">para ortodoncistas.</span>
            </span>
            <h1 className="text-xl text-white text-center font-normal">
                Ortodoncia Digital
                <br />
                <span className="font-bold">precisa, clínica, diseñada para vos.</span>
            </h1>
            <div className="flex flex-col items-center justify-center w-full relative">
                <span className="text-left text-lg text-light-blue-text absolute left-[15%] top-[5%]">Alineadores <br />Invisibles.</span>
                <div className="w-[335px] h-[422px] relative">
                    <Image
                        src={Images.mobile.hero.go}
                        alt="Go"
                        width={500}
                        height={400}
                        className="
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        w-[100%] h-auto
        opacity-90
        mix-blend-overlay
        drop-shadow-[0_4px_12px_rgba(255,255,255,0.05)]
        pointer-events-none select-none
    "
                        priority
                    />
                </div>

                <div className="absolute bottom-[33%] right-[13%] mb-2">
                    <Image
                        src={Images.mobile.hero.logo}
                        alt="Logo"
                        width={100}
                        height={36}
                    />
                </div>
            </div>
            <div className="pt-6">
                <p className="text-xl text-center text-white">Un paso hacia lo invisible <br />
                    <span className="font-bold">marca una diferencia visible.</span>
                </p>
            </div>
            <div>
                <span className="text-xs text-blue-custom text-center"><span className="font-bold">Indigo&reg;</span> alineadores invisibles.</span>
            </div>
            <button className="cursor-pointer">
                <Image
                    src={Images.desktop.common.btnContactanos}
                    alt="Logo"
                    width={200}
                    height={30}
                    className="h-9"
                />
            </button>
        </div>
    )
}

export default Hero

'use client'

import Image from 'next/image'
import { Images } from '../images'
import { WHATSAPP_LINK } from '../constants'
import Link from 'next/link'

const SectionFive = () => {
    return (
        <div className="relative w-full h-[60vh] overflow-hidden md:hidden">
            <Image
                src={Images.mobile.sectionFive.team}
                alt="Team"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 z-10 flex justify-center text-center w-full p-8 text-white mx-auto">
                <p className="text-xl font-normal">Especialistas y expertas <br></br> en Ortodoncia Digital.</p>
            </div>
            <div className="absolute inset-0 z-10 flex justify-center items-end p-6 ">
                <Link href="/contactar" className="cursor-pointer">
                    <Image
                        src={Images.desktop.common.btnContactanosGradient}
                        alt="Contactanos"
                        width={127}
                        height={20}
                        className="object-cover"
                    />
                </Link>
            </div>
        </div>
    )
}

export default SectionFive

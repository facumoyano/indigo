import Image from 'next/image'
import React from 'react'
import { Images } from '../images'
import { WHATSAPP_LINK } from '../constants'

const SectionTwoDesktop = () => {
    return (
        <div id="alineadores" className='bg-[#606eb2] min-h-[80vh] px-8 py-16 relative hidden md:block'>
            <div className='flex container mx-auto h-full'>
                <div className='w-[35%] flex justify-center items-center flex-col space-y-8'>
                    <Image
                        src={Images.desktop.sectionTwo.go}
                        alt="Go"
                        width={100}
                        height={36}
                        className="object-cover"
                    />
                    <p className='text-white text-3xl text-center'>Alineadores invisibles de <span className='font-bold'>Ortodoncistas para ortodoncistas</span></p>
                </div>
                <div className='w-full flex justify-end flex-col items-center space-y-24'>
                    <Image
                        src={Images.desktop.sectionTwo.dientes}
                        alt="Dientes"
                        width={500}
                        height={500}
                        className='z-10'
                    />
                    <div>
                        <p className='text-light-blue-text text-2xl text-center'>Simplificá lo complejo <br /><span className='font-bold'>transformá tu consultorio con <br /> Ortodoncia Digital ahora.</span></p>
                    </div>
                </div>
                <div className='w-[35%] flex justify-center items-center flex-col space-y-8'>
                    <p className='text-light-blue-text text-center'><span className='font-bold'>Indigo&reg;</span> <br />alineadores invisibles</p>
                    <p className='text-white text-3xl text-center'><span className='font-bold'>Tecnología de punta, experiencia y criterio clínico</span> en un solo lugar.</p>
                </div>
            </div>
            <div
                className="bg-[url('/images/desktop/section-two/mid-circle.svg')] absolute bottom-0 left-1/2 -translate-x-1/2  h-[450px] w-[900px] brightness-[0.15] bg-center bg-no-repeat bg-cover mix-blend-color-burn z-0"
            >
            </div>
            <div className='absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10'>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className='cursor-pointer'>
                    <Image
                        src={Images.desktop.common.btnContactanosGradient}
                        alt="Contactanos"
                        width={170}
                        height={50}
                        className="object-cover"
                    />
                </a>
            </div>
        </div>
    )
}

export default SectionTwoDesktop

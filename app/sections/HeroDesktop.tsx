import NavbarDesktop from '@/components/navbar-desktop'
import Image from 'next/image'
import React from 'react'
import { Images } from '../images'
import { WHATSAPP_LINK } from '../constants'


const HeroDesktop = () => {
    return (
        <>
            <NavbarDesktop />
            <div className="bg-[url('/images/desktop/hero/bg-gradient.svg')] h-[calc(100vh-80px)] w-full bg-cover px-8 hidden md:block">
                <div className='flex container mx-auto h-full'>
                    <div className='py-20 flex flex-col justify-between h-full w-[70%] '>
                        <p className='text-white text-3xl'>De ortodoncistas <br /><span className='font-bold'>para ortodoncistas.</span></p>
                        <div className='space-y-6'>
                            <h1 className='text-white text-4xl'>Ortodoncia Digital <br /><span className='font-bold'>precisa, clínica, diseñada para vos.</span></h1>
                            <p className='text-2xl text-blue-text'>Un paso hacia lo invisible <br /><span className='font-bold'>marca una diferencia visible.</span></p>
                        </div>
                        <p className='text-xl text-white'><span className='font-bold'>Indigo&reg;</span> alineadores invisibles.</p>
                    </div>
                    <div className='relative w-full'>
                        <Image
                            src={Images.desktop.hero.go}
                            alt="Go"
                            width={1500}
                            height={1500}
                            className="
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        w-full h-full
        opacity-90
        object-cover
        mix-blend-overlay
        drop-shadow-[0_4px_12px_rgba(255,255,255,0.05)]
        pointer-events-none select-none
        "
                            priority
                        />
                        <Image
                            src={Images.desktop.hero.indigo}
                            alt="Logo"
                            width={170}
                            height={100}
                            className="
        absolute right-20 top-1/2 -translate-y-1/2 mt-10
        object-cover
        "

                            priority
                        />
                        {/* TODO: Cambiar btn por imagen aca y en mobile */}
                        <div className='flex items-end h-full justify-end pb-16'>
                            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className='cursor-pointer'>
                                <Image
                                    src={Images.desktop.common.btnContactanos}
                                    alt="Contactanos"
                                    width={170}
                                    height={50}
                                    className="object-cover"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeroDesktop

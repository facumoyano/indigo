import React from 'react'
import { Images } from '../images'
import Image from 'next/image'
import Link from 'next/link'

import { NAV_LINKS } from '@/components/nav-links'

const SectionContact = () => {
    return (
        <div className='mt-12 md:hidden pb-4' id="contacto">
            <div
                className="min-h-[700px] bg-contain bg-no-repeat bg-center relative w-full"
                style={{
                    backgroundImage: `url(${Images.mobile.sectionContact.caras})`
                }}
            >
                <div className='transform -rotate-90 absolute right-15 top-75 -translate-y-1/2'>
                    <p className='text-gray-text text-2xl'>Donde vayas, <br /><span className='font-bold'>andá sonriendo.</span></p>
                </div>
                <Image
                    src={Images.mobile.sectionContact.logo}
                    alt="Logo"
                    width={110}
                    height={50}
                    className='absolute bottom-10 right-18'
                />
            </div>
            <div className='mt-10 px-16'>
                <p className='text-xs text-blue-text'>
                    <span className='font-bold'>Indigo&reg;</span>
                    <br />
                    Alineadores
                    <br />
                    Invisibles
                </p>
                <div className='mt-4 flex'>
                    <nav className='w-full flex flex-col gap-1'>
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className='text-gray-text text-xs'>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className='flex flex-col w-full'>
                        <p className='text-[10px] text-gray-text'>Transformá tu consultorio con Ortodoncia Digital</p>
                        <ul className='mt-4'>
                            <li>
                                <p className=' text-blue-text text-[10px]'><span className='font-bold'>Correo:</span> sonrisasindigo@gmail.com</p>
                            </li>
                            <li> <a href="https://www.instagram.com/sonrisasindigo" target="_blank" rel="noreferrer" className='text-blue-text text-[10px]'><span className='font-bold'>Instagram:</span> @sonrisasindigo</a>   </li>
                            <li> <a href="https://www.instagram.com/migrandoal3d" target="_blank" rel="noreferrer" className='text-blue-text text-[10px]'><span className='font-bold'>Cursos:</span> @migrandoal3d</a>   </li>
                        </ul>
                    </div>
                </div>
                <div className='w-full flex justify-center items-center  text-gray-text text-[11px] pt-4'>
                    <p>Copyright © 2025 - <span className='font-semibold'>Indigo&reg;</span></p>
                </div>
            </div>
        </div>
    )
}

export default SectionContact

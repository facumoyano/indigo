import React from 'react'
import Link from 'next/link'

import { NAV_LINKS } from '@/components/nav-links'

const SectionContactDesktop = () => {
  return (
    <div id='contacto' className='hidden md:block my-14'>
        <div className='container mx-auto px-8 flex w-full'>
            <div className='text-blue-text text-lg w-full leading-6'>
                <p className='font-bold'>Indigo&reg;</p>
                <p>Alineadores</p>
                <p>Invisibles</p>
            </div>
            <div className='w-full text-lg'>
                <nav className='text-gray-text font-semibold flex flex-col gap-2 mt-2'>
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className='w-full text-lg'>
                <p className='text-gray-text leading-6 font-semibold'>Transformá tu consultorio <br /><span className='font-semibold'>con Ortodoncia Digital</span></p>
                <ul className='text-blue-text my-6'>
                    <li><span className='font-semibold'>Correo:</span> sonrisasindigo@gmail.com</li>
                    <li><span className='font-semibold'>Ig:</span> @sonrisasindigo</li>
                    <li><span className='font-semibold'>Cursos:</span> /migrandoal3d.ar</li>
                </ul>
            </div>
            <div className='w-full flex justify-end items-end  text-gray-text text-lg'>
                <p>Copyright © 2025 - <span className='font-semibold'>Indigo&reg;</span></p>
            </div>
        </div>
    </div>
  )
}

export default SectionContactDesktop

import React from 'react'
import { Images } from '../images'
import Image from 'next/image'
import { WHATSAPP_LINK } from '../constants'
import Link from 'next/link'

const SectionSevenDesktop = () => {
  return (
    <div id="iniciar" className="hidden md:block relative w-full h-[130vh] bg-no-repeat bg-contain bg-center px-8 container mx-auto"
          style={{ backgroundImage: `url(${Images.desktop.sectionSeven.caras})` }}>
            <div className='space-y-6 flex flex-col items-center pt-10 text-center'>
                <p className='text-gray-text fonnt-bold text-2xl'>Supervisamos.<br />Acompañamos. Resolvemos.</p>
                <p className='text-blue-text text-2xl'>No necesitás grandes <br /> inversiones o infraestructura.</p>
                <p className='text-blue-text font-bold text-2xl'>Trabajar con alineadores y <br /> un equipo de especialistas <br /> que domine la Ortodoncia <br /> Digital es posible.</p>
                <Link  href="/contactar" className='cursor-pointer'>
                    <Image
                        src={Images.desktop.common.btnEmpeza}
                        alt="Empezar"
                        width={180}
                        height={40}
                    />
                </Link>
            </div>
    </div>
  )
}

export default SectionSevenDesktop

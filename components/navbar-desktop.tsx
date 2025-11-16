import { Images } from '@/app/images'
import Image from 'next/image'
import React from 'react'

const NavbarDesktop = () => {
  return (
    <div className='bg-white h-20 hidden md:block'>
      <div className='container mx-auto px-8 flex justify-between items-center w-full h-full'>
        <div>
          <Image
            src={Images.desktop.common.logoNav}
            alt="Logo"
            width={200}
            height={100}
            className=''
          />
        </div>
        <div className='flex space-x-6'>
          <a href="#alineadores" className='text-gray-text text-lg font-normal cursor-pointer'>Alineadores</a>
          <a href="#hacemos" className='text-gray-text text-lg font-normal cursor-pointer'>Hacemos</a>
          <a href="#sumate" className='text-gray-text text-lg font-normal cursor-pointer'>Sumate</a>
          <a href="#nosotras" className='text-gray-text text-lg font-normal cursor-pointer'>Nosotras</a>
          <a href="#iniciar" className='text-gray-text text-lg font-normal cursor-pointer'>Iniciar</a>
          <a href="#contacto" className='text-gray-text text-lg font-normal cursor-pointer'>Contacto</a>
        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop

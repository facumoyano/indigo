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
          <p className='text-gray-text text-lg font-normal'>Alineadores</p>
          <p className='text-gray-text text-lg font-normal'>Hacemos</p>
          <p className='text-gray-text text-lg font-normal'>Sumate</p>
          <p className='text-gray-text text-lg font-normal'>Nosotras</p>
          <p className='text-gray-text text-lg font-normal'>Iniciar</p>
          <p className='text-gray-text text-lg font-normal'>Contacto</p>
        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop
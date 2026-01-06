import { Images } from '@/app/images'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { NAV_LINKS } from './nav-links'

const NavbarDesktop = () => {
  return (
    <div className='bg-white h-20 hidden md:block'>
      <div className='container mx-auto px-8 flex justify-between items-center w-full h-full'>
        <div>
          <Link href='/' className='cursor-pointer'>
          <Image
            src={Images.desktop.common.logoNav}
            alt="Logo"
            width={200}
            height={100}
            className=''
          />
          </Link>
        </div>
        <div className='flex space-x-6'>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className='text-gray-text text-lg font-normal cursor-pointer'>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop

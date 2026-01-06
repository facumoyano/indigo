'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import { Images } from '@/app/images'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { NAV_LINKS } from './nav-links'

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className='md:hidden fixed inset-x-0 top-0 z-[200] border-b bg-white shadow-[0_10px_40px_rgba(96,110,182,0.15)]'>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <div className='flex items-center justify-between px-4 py-4'>
            <Link href='/' onClick={() => setIsOpen(false)} className='flex items-center gap-2'>
              <Image src={Images.mobile.common.logo} alt='Indigo' width={120} height={44} className='h-9 w-auto object-contain' />
            </Link>
            <DialogTrigger asChild>
              <button
                type='button'
                className='p-2 rounded-full border border-blue-custom/30 text-blue-custom focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-custom/50'
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
              </button>
            </DialogTrigger>
          </div>
          <DialogContent
            showCloseButton={false}
            className='top-0 left-0 h-[100vh] w-full translate-x-0 translate-y-0 rounded-none border-none max-w-none px-6 py-8 bg-white text-left z-[9999]'
          >
            <DialogTitle className='hidden'></DialogTitle>
            <div className='flex flex-col gap-8 h-full'>
            <div className='flex items-center justify-between'>
              <Image src={Images.mobile.common.logo} alt='Indigo' width={120} height={42} className='h-10 w-auto object-contain' />
              <DialogClose asChild>
                <button
                  type='button'
                  className='p-2 rounded-full border border-blue-custom/30 text-blue-custom focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-custom/50'
                  aria-label='Cerrar menú'
                >
                  <X className='h-5 w-5' />
                </button>
              </DialogClose>
            </div>
            <nav className='flex flex-col gap-4 text-lg font-medium text-blue-custom'>
              {NAV_LINKS.map((link) => (
                <DialogClose asChild key={link.href}>
                  <Link href={link.href} className='py-3 border-b border-gray-100'>
                    {link.label}
                  </Link>
                </DialogClose>
              ))}
            </nav>
          </div>
        </DialogContent>
      </Dialog>
      </header>
    </>
  )
}

export default NavbarMobile

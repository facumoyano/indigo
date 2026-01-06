import NavbarDesktop from '@/components/navbar-desktop'
import NavbarMobile from '@/components/navbar-mobile'
import React from 'react'

import FormContact from '@/components/form-contact'



const ContactPage = () => {

    return (
        <div>
            <NavbarDesktop />
            <NavbarMobile />
            <div className='max-w-[600px] mx-auto mt-10 md:mt-20 p-4'>
                <h1 className='text-2xl md:text-3xl text-blue-custom'>Primer contacto con <span className='font-bold'>Indigo&reg;</span><br />Solicitud de información personal</h1>
                <div className='h-[1px] bg-blue-custom w-full my-4'></div>
                <div className='text-gray-text text-base md:text-xl space-y-6'>
                    <p className='font-bold '>¡Bienvenid@!</p>
                    <p>Completá este formulario con tus datos si deseás obtener más información sobre nuestro servicio.</p>
                    <p className='font-bold'>Nuestra metodología de trabajo es 100%
                        personalizada para cada profesional.</p>

                    <div>
                        <FormContact />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage

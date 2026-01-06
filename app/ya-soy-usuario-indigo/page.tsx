import NavbarDesktop from '@/components/navbar-desktop'
import NavbarMobile from '@/components/navbar-mobile'
import React from 'react'

import FormYaSoyUsuario from '@/components/form-soy-usuario'



const YaSoyUsuarioPage = () => {

    return (
        <div>
            <NavbarDesktop />
            <NavbarMobile />
            <div className='max-w-[600px] mx-auto mt-20 md:mt-20 p-4'>
                <h1 className='text-2xl md:text-3xl text-blue-custom'>Solicitud de pedido y registro de caso <br />para usuario/a vigente de <span className='font-bold'>Indigo&reg;</span></h1>
                <div className='h-[1px] bg-blue-custom w-full my-4'></div>
                <div className='text-gray-text text-base md:text-xl space-y-6'>
                    <p className='font-bold '>¡Bienvenid@!</p>
                    <p>Si ya sos usuario/a vigente de <span className='font-bold'>Indigo&reg;</span> completá este
                        formulario con la información y los archivos solicitados,
                        para comenzar con el diseño y confección del
                        tratamiento de tu paciente.</p>
                    <p>No completes este formulario si estás realizando tu
                        contacto o consulta por primera vez.</p>

                    <div>
                        <FormYaSoyUsuario />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YaSoyUsuarioPage

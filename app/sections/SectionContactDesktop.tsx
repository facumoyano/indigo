import React from 'react'

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
                <a href='#alineadores' className='font-bold text-blue-text'>Alineadores</a>
                <ul className='text-gray-text font-semibold'>
                    <li><a href="#hacemos">Hacemos</a></li>
                    <li><a href="#sumate">Sumate</a></li>
                    <li><a href="#nosotras">Nosotras</a></li>
                    <li><a href="#iniciar">Iniciar</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
            </div>
            <div className='w-full text-lg'>
                <p className='text-gray-text leading-6 font-semibold'>Transformá tu consultorio <br /><span className='font-semibold'>con Ortodoncia Digital</span></p>
                <ul className='text-blue-text my-6'>
                    <li><span className='font-semibold'>Whtsp:</span> +54 9 358 XXX XXXX</li>
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

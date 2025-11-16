import React from 'react'
import { Images } from '@/app/images'
import Image from 'next/image'

const SectionFourDesktop = () => {
    return (
        <div
            className="hidden md:block relative w-screen aspect-[1920/900] min-h-[90vh] bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${Images.desktop.sectionFour.bgGradient})` }}
        >
            <div className='container mx-auto px-8 pt-34'>
                <div className='flex gap-8 items-center justify-center'>
                    <div className='w-[35%]'>
                        <p className='text-blue-text text-3xl'>Cada inicio de tratamiento, <br /><span className='font-bold'>incluye un set de presentación con la identidad oficial de Índigo&reg;.</span></p>
                    </div>
                    <div className='w-[40%]'>
                        <Image
                            src={Images.desktop.sectionFour.cartuchera}
                            alt="Cartuchera"
                            width={500}
                            height={500}
                            className='z-10'
                        />
                    </div>
                    <div className='text-blue-text text-lg w-[25%] leading-6'>
                        <p className='font-bold'>Set iniciación Índigo&reg;</p>
                        <p>- Estuche.</p>
                        <p>- Porta alineadores.</p>
                        <p>- Accesorios extras.</p>
                    </div>
                </div>
                <div>
                    <p className='text-center text-white text-3xl'>
                        Transformá tu consultorio con <span className='font-bold'>Ortodoncia Digital y <br />elevá la experiencia de tu paciente, </span>ganando:
                    </p>
                </div>
                <div className='grid grid-cols-4 gap-16 mt-16'>
                    <div className='text-white space-y-1'>
                        <Image
                            src={Images.mobile.sectionFour.check}
                            alt="Check"
                            width={24}
                            height={24}
                        />
                        <p className='text-lg font-bold mt-4'>Ahorro de tiempo</p>
                        <p className='text-lg'>- Delegás la planificación digital y la producción, concentrándote en la clínica.</p>
                    </div>
                    <div className='text-white space-y-1'>
                        <Image
                            src={Images.mobile.sectionFour.check}
                            alt="Check"
                            width={24}
                            height={24}
                        />
                        <p className='text-lg font-bold mt-4'>Respaldo experto</p>
                        <p className='text-lg'>- Cada caso está acompañado por ortodoncistas especialistas en ortodoncia digital.</p>
                    </div>
                    <div className='text-white space-y-1'>
                        <Image
                            src={Images.mobile.sectionFour.check}
                            alt="Check"
                            width={24}
                            height={24}
                        />
                        <p className='text-lg font-bold mt-4'>Seguridad y confianza</p>
                        <p className='text-lg'>- Diseños validados con criterio clínico que garantizan tratamientos más predecibles.</p>
                    </div>
                    <div className='text-white space-y-1'>
                        <Image
                            src={Images.mobile.sectionFour.check}
                            alt="Check"
                            width={24}
                            height={24}
                        />
                        <p className='text-lg font-bold mt-4'>Soporte constante</p>
                        <p className='text-lg'>- Un equipo disponible para resolver dudas, revisar cambios y acompañarte en todo </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionFourDesktop

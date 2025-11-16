import Image from 'next/image'
import React from 'react'
import { Images } from '../images'

const SectionFour = () => {
    // TODO: Cambiar imagen de cartuchera por agrupada
    return (
        <div className='md:hidden'>
            <div
                className="w-full min-h-[80vh] bg-cover bg-no-repeat relative [background-position:center_40%] pb-10"
                style={{
                    backgroundImage: `url(${Images.mobile.sectionFour.bgGradient})`,
                }}
            >
                <p className='text-blue-text text-xl mt-8 px-12'>Cada inicio de tratamiento, <br /><span className='font-bold'>incluye un set de presentación con la identidad oficial de Índigo&reg;.</span></p>
                <div className='-mt-15'>
                    <div className='relative flex items-center justify-center'>
                        <Image
                            src={Images.mobile.sectionThree.cartuchera}
                            alt="Cartuchera"
                            width={250}
                            height={40}
                            className='w-[80%]'
                        />
                    </div>
                    <div className='mx-12 -mt-4'>
                        <div>
                            <p className='font-bold text-sm text-white'>Set iniciación Índigo&reg;</p>
                            <p className='text-sm text-white'>- Estuche. Porta alineadores. Accesorios extras.</p>
                        </div>
                        <div className='mt-4'>
                            <h3 className='text-light-blue-text text-xl'>
                                Transformá tu consultorio con <span className='font-bold'>Ortodoncia Digital</span> y <span className='font-bold'>elevá la experiencia de tu paciente, </span> ganando:
                            </h3>
                        </div>
                        <div className='mt-6 grid grid-cols-2 gap-4'>
                            <div className='text-white space-y-2'>
                                <Image
                                    src={Images.mobile.sectionFour.check}
                                    alt="Check"
                                    width={24}
                                    height={24}
                                />
                                <p className='text-sm font-bold'>Ahorro de tiempo</p>
                                <p className='text-sm'>- Delegás la planificación digital y la producción, concentrándote en la clínica.</p>
                            </div>
                            <div className='text-white space-y-2'>
                                <Image
                                    src={Images.mobile.sectionFour.check}
                                    alt="Check"
                                    width={24}
                                    height={24}
                                />
                                <p className='text-sm font-bold'>Respaldo experto</p>
                                <p className='text-sm'>- Cada caso está acompañado por ortodoncistas especialistas en ortodoncia digital.</p>
                            </div>
                            <div className='text-white space-y-2'>
                                <Image
                                    src={Images.mobile.sectionFour.check}
                                    alt="Check"
                                    width={24}
                                    height={24}
                                />
                                <p className='text-sm font-bold'>Seguridad y confianza</p>
                                <p className='text-sm'>- Diseños validados con criterio clínico que garantizan tratamientos más predecibles.</p>
                            </div>
                            <div className='text-white space-y-2'>
                                <Image
                                    src={Images.mobile.sectionFour.check}
                                    alt="Check"
                                    width={24}
                                    height={24}
                                />
                                <p className='text-sm font-bold'>Soporte constante</p>
                                <p className='text-sm'>- Un equipo disponible para resolver dudas, revisar cambios y acompañarte en todo </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionFour
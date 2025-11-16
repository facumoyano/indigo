import Image from 'next/image'
import React from 'react'
import { Images } from '../images'

const SectionSixDesktop = () => {
    return (
        <div id='nosotras' className='hidden md:block relative'>
            <div className='grid grid-cols-4 pb-10'>
                <div>
                    <div className='relative h-[600px] w-full'>
                        <Image
                            src={Images.desktop.sectionSix.viviPolimanti}
                            alt="Vivi Polimanti"
                            fill
                            className="object-cover object-center"
                        />
                        <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                            <p className='text-blue-text text-md'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                            <p className='text-xl text-white'>Dra. Viviana Polimanti</p>
                        </div>
                    </div>
                    <div className='space-y-2 text-gray-text text-normal py-6 px-10'>
                        <p><span className='font-bold'>- Especialista en</span> Ortodoncia y Ortopedia Dentofacial.</p>
                        <p><span className='font-bold'>- Directora en Dimax</span> Diagnóstico Odontológico, combina práctica clínica con formación en ortodoncia digital, liderando diplomaturas y capacitaciones.</p>
                        <p><span className='font-bold'>- Forma parte del staff</span> de alto nivel en diagnóstico por imágenes.</p>
                        <p><span className='font-bold'>- Lidera cursos de alineadores in-Office</span> Migrando al 3D e integra el cuerpo docente de la Diplomatura en Ortodoncia Digital de la Facultad de.</p>
                    </div>
                </div>
                <div>
                    <div className='relative h-[600px] w-full'>
                        <Image
                            src={Images.desktop.sectionSix.paulinaDiaz}
                            alt="Paulina Diaz"
                            fill
                            className="object-cover object-center"
                        />
                        <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                            <p className='text-blue-text text-md'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                            <p className='text-xl text-white'>Dra. Paulina Díaz</p>
                        </div>
                    </div>
                    <div className='space-y-2 text-gray-text text-normal py-6 px-10'>
                        <p><span className='font-bold'>- Especialista en</span> Ortodoncia y Ortopedia Dentofacial.</p>
                        <p><span className='font-bold'>- Es dictante de cursos de alineadores in-office y referente en el área</span> junto al equipo Migrando al 3D. Además, es colaboradora internacional en cursos de formación en ortodoncia digital de la empresa de software Nemotec en España y Latinoamérica. </p>
                        <p><span className='font-bold'>-  Ejerce su práctica privadax</span> en Ibáñez Odontología, con dedicación exclusiva a la ortodoncia digital y alineadores.</p>
                        <p><span className='font-bold'>- Co-directora de la Diplomatura en Ortodoncia Digital  </span> Facultad de Odontología, Universidad Nacional de Córdoba y docente invitada en la Maestría en Ortodoncia Digital de la .</p>
                        <p><span className='font-bold'>- Combina su práctica privada</span> con la formación continua de ortodoncistas de Argentina y el exterior.</p>
                    </div>
                </div>
                <div>
                    <div className='relative h-[600px] w-full'>
                        <Image
                            src={Images.desktop.sectionSix.ayeOlivera}
                            alt="Aye Olivera"
                            fill
                            className="object-cover object-center"
                        />
                        <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                            <p className='text-blue-text text-dm'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                            <p className='text-xl text-white'>Dra. Ayelén Olivera</p>
                        </div>
                    </div>
                    <div className='space-y-2 text-gray-text text-normal py-6 px-10'>
                        <p><span className='font-bold'>- Especialista en</span> Ortodoncia y Ortopedia Dentomaxilofacial. </p>
                        <p><span className='font-bold'>- Lidera cursos de alineadores In-Office</span> en Migrando al 3D e integra el cuerpo docente de la Diplomatura en Ortodoncia Digital de la Facultad de Odontología de UNC.</p>
                        <p><span className='font-bold'>- Se dedica exclusivamente a la ortodoncia digital </span> y es Directora Médica de Dimax Diagnóstico Digital.</p>
                    </div>
                </div>
                <div>
                    <div className='relative h-[600px] w-full'>
                        <Image
                            src={Images.desktop.sectionSix.cataRey}
                            alt="Catalina Fey"
                            fill
                            className="object-cover object-center"
                        />
                        <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                            <p className='text-blue-text text-md'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                            <p className='text-xl text-white'>Dra. Catalina Fey</p>
                        </div>
                    </div>
                    <div className='space-y-2 text-gray-text text-normal py-6 px-10'>
                        <p><span className='font-bold'>- Especialista en</span> Ortodoncia y Ortopedia Dentomaxilofacial, graduada con mención de honor en la Universidad Nacional de Córdoba.</p>
                        <p><span className='font-bold'>- Ejerce práctica privada</span> con dedicación exclusiva a la ortodoncia digital y alineadores.</p>
                        <p><span className='font-bold'>- Docente en la Diplomatura Universitaria de Ortodoncia Digital</span> (UNC) e integrante de proyectos de investigación, actualmente desarrollando su tesis doctoral.</p>
                        <p><span className='font-bold'>- Lidera cursos de alineadores in-Office</span> en Migrando al 3D e integra el cuerpo docente de la Diplomatura en Ortodoncia Digital de la Facultad de Odontología de UNC.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionSixDesktop

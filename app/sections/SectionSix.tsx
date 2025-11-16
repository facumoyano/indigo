import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import { Images } from '../images'

const SectionSix = () => {
    return (
        <div className='relative md:hidden'>
            <Carousel className="w-full relative">
                <CarouselContent>
                    <CarouselItem>
                        <div>
                            <div className='h-[470px] relative'>
                                <Image
                                    src={Images.mobile.sectionSix.viviPolimanti}
                                    alt="Vivi Polimanti"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                                <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                                    <p className='text-blue-text text-sm'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                                    <p className='text-xl text-white'>Dra. Viviana Polimanti</p>
                                </div>
                            </div>
                            <div className='mt-4 columns-2 gap-x-4 px-8'>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Especialista en</p>
                                    <p>Ortodoncia y Ortopedia Dentomaxilofacial.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Directora en Dimax</p>
                                    <p>Diagnóstico Odontológico, combina práctica clínica con formación en ortodoncia digital, liderando diplomaturas y capacitaciones.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Forma parte del staff</p>
                                    <p>de alto nivel en diagnóstico por imágenes.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Lidera cursos de alineadores in-Office</p>
                                    <p>Migrando al 3D e integra el cuerpo docente de la Diplomatura en Ortodoncia Digital de la Facultad de.</p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div>
                            <div className='h-[470px] relative'>
                                <Image
                                    src={Images.mobile.sectionSix.paulinaDiaz}
                                    alt="Paulina Diaz"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                                <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                                    <p className='text-blue-text text-sm'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                                    <p className='text-xl text-white'>Dra. Paulina Díaz</p>
                                </div>
                            </div>
                            <div className='mt-4 columns-2 gap-x-4 px-8'>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Especialista en</p>
                                    <p>Ortodoncia y Ortopedia Dentofacial.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Es dictante de cursos de alineadores in-office y referente en el área</p>
                                    <p>junto al equipo Migrando al 3D. Además, es colaboradora internacional en cursos de formación en ortodoncia digital de la empresa de software Nemotec en España y Latinoamérica. </p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>-  Ejerce su práctica privadax</p>
                                    <p>en Ibáñez Odontología, con dedicación exclusiva a la ortodoncia digital y alineadores.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Co-directora de la Diplomatura en Ortodoncia Digital  </p>
                                    <p>Facultad de Odontología, Universidad Nacional de Córdoba y docente invitada en la Maestría en Ortodoncia Digital de la .</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Combina su práctica privada</p>
                                    <p> con la formación continua de ortodoncistas de Argentina y el exterior.</p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div>
                            <div className='h-[470px] relative'>
                                <Image
                                    src={Images.mobile.sectionSix.ayeOlivera}
                                    alt="Aye Olivera"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                                <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                                    <p className='text-blue-text text-sm'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                                    <p className='text-xl text-white'>Dra. Ayelén Olivera</p>
                                </div>
                            </div>
                            <div className='mt-4 columns-2 gap-x-4 px-8'>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Especialista en</p>
                                    <p>Ortodoncia y Ortopedia Dentomaxilofacial. </p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Se dedica exclusivamente a la ortodoncia digital </p>
                                    <p>y es Directora Médica de Dimax Diagnóstico Digital.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Lidera cursos de alineadores In-Office</p>
                                    <p>en Migrando al 3D e integra el cuerpo docente de la Diplomatura en Ortodoncia Digital de la Facultad de Odontología de </p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div>
                            <div className='h-[470px] relative'>
                                <Image
                                    src={Images.mobile.sectionSix.cataRey}
                                    alt="Catalina Fey"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                                <div className='absolute inset-0 z-10 flex flex-col text-center items-center p-6 '>
                                    <p className='text-blue-text text-sm'>Especialista <span className='font-bold'>Índigo&reg;</span></p>
                                    <p className='text-xl text-white'>Dra. Catalina Fey</p>
                                </div>
                            </div>
                            <div className='mt-4 columns-2 gap-x-4 px-8'>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Especialista en</p>
                                    <p>Ortodoncia y Ortopedia Dentomaxilofacial, graduada con mención de honor en la Universidad Nacional de Córdoba.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Ejerce práctica privada </p>
                                    <p>con dedicación exclusiva a la ortodoncia digital y alineadores.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Docente en la Diplomatura Universitaria de Ortodoncia Digital</p>
                                    <p>(UNC) e integrante de proyectos de investigación, actualmente desarrollando su tesis doctoral.</p>
                                </div>
                                <div className='text-gray-text text-sm break-inside-avoid mb-4'>
                                    <p className='font-bold'>- Lidera cursos de alineadores in-Office</p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="!left-6 top-1/4 -translate-y-1/2 z-20 backdrop-blur bg-transparent  border-none" />
                <CarouselNext className="!right-6 top-1/4 -translate-y-1/2 z-20 backdrop-blur  bg-transparent border-none" />
            </Carousel>
        </div>
    )
}

export default SectionSix

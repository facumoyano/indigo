import Image from 'next/image'
import React from 'react'
import { Images } from '../images'
import CardInsignia from '../components/section-three/card-insignia'

const SectionThree = () => {
    return (
        <div className=" relative px-4 md:hidden" id="hacemos">
            <Image
                src={Images.mobile.sectionThree.circleGreen}
                alt="Circle"
                width={220}
                height={140}
                className="absolute -top-4 -right-1/6 z-10"
            />
            <div className="w-full flex flex-col justify-center">
                <div
                    className="h-[140px] w-[280px] bg-cover bg-center flex justify-center items-center text-center mx-auto"
                    style={{
                        backgroundImage: `url(${Images.mobile.sectionThree.circleBlueGray})`,
                    }}
                >
                    <Image
                        src={Images.mobile.sectionThree.go}
                        alt="Go"
                        width={55}
                        height={36}
                        className='mb-14'
                    />
                </div>
            </div>
            <div className='px-8 mt-14 space-y-8'>
                <h3 className='text-xl text-blue-text'>Te contamos qué hace <br /><span className='font-bold'>Indigo&reg; por vos.</span></h3>
                <div className='space-y-8 text-xl text-gray-text'>
                    <p>Brindamos un servicio integral de diseño y fabricación de alineadores invisibles pensado exclusivamente para ortodoncistas.</p>
                    <p>Cada caso se planifica con rigurosidad clínica, empleando software de vanguardia y materiales certificados, para asegurar resultados predecibles y de alta calidad.</p>
                    <p><span className='font-bold'> Nuestro objetivo es que vos te concentres en el paciente</span>, mientras nosotras nos ocupamos de todo el proceso digital.</p>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-14'>
                    <CardInsignia
                        title="Proceso personalizado"
                        description="Cada caso se planifica de manera única, adaptado a la necesidad del paciente y al criterio clínico del ortodoncista."
                        color="blue"
                    />
                    <CardInsignia
                        title="Comunicación fluída"
                        description="Acompañamos a cada colega con atención cercana y disponibilidad constante para resolver dudas o ajustes."
                        color="purple"
                    />
                    <CardInsignia
                        title="Supervisión de ortodoncistas en todas las etapas"
                        description='La seguridad de que cada etapa
                        del proceso es diseñada y supervisada por especialistas en ortodoncia digital.'
                        color='orange'
                    />
                    <CardInsignia
                        title="Tecnología de punta + materiales de alta calidad"
                        description='Utilizamos software de vanguardia y materiales aprobados internacionalmente que garantizan precisión y confort.'
                        color='green'
                    />

                </div>
                <div className='mt-8'>
                    <h3 className='text-xl text-blue-text'>Te contamos cómo <br /><span className='font-bold'>trabajar con Indigo&reg;.</span></h3>
                    <p className='text-xl text-gray-text mt-4'>Es muy simple.</p>
                    <div className='text-blue-text text-base space-y-4 mt-8'>
                        <p className='font-bold'>Primer contacto</p>
                        <p>El proceso inicia con la solicitud de los registros necesarios para evaluar el caso.</p>
                        <p>Luego, te compartimos nuestra dinámica de trabajo y los costos correspondientes.</p>
                    </div>
                    <div className='mt-8 grid grid-cols-2 gap-4'>
                        <div className='space-y-4'>
                            <Image
                                src={Images.mobile.sectionThree.circle1}
                                alt="1"
                                width={30}
                                height={30}
                            />
                            <p className='font-bold text-gray-text text-sm'>Carga del caso</p>
                            <p className='text-sm text-gray-text'>Subís los escaneos y la información clínica de tu paciente al portal Indigo.</p>
                        </div>
                        <div className='space-y-4'>
                            <Image
                                src={Images.mobile.sectionThree.circle2}
                                alt="2"
                                width={30}
                                height={30}
                            />
                            <p className='font-bold text-gray-text text-sm'>Planificación Digital</p>
                            <p className='text-sm text-gray-text'>Nuestro equipo de ortodoncistas diseña un setup virtual de acuerdo a tus objetivos clínicos.</p>
                        </div>
                        <div className='space-y-4'>
                            <Image
                                src={Images.mobile.sectionThree.circle3}
                                alt="3"
                                width={30}
                                height={30}
                            />
                            <p className='font-bold text-gray-text text-sm'>Fabricación de alineadores</p>
                            <p className='text-sm text-gray-text'>Una vez que el plan es aprobado, fabricamos los alineadores con máxima precisión y materiales certificados.</p>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-1'>
                                <Image
                                    src={Images.mobile.sectionThree.circle3}
                                    alt="3"
                                    width={30}
                                    height={30}
                                />
                                <p className='text-[#a7e6d7] text-[10px] font-bold'>Opción 1.</p>
                            </div>
                            <p className='font-bold text-gray-text text-sm'>Sin medios propios de impresión y termoformado:</p>
                            <p className='text-sm text-gray-text'>Nos ocupamos de todo el proceso.Planificación, fabricación y entrega de los .</p>
                        </div>
                        <div className='space-y-4'>
                           <div className='flex items-center gap-1'>
                                <Image
                                    src={Images.mobile.sectionThree.circle3}
                                    alt="3"
                                    width={30}
                                    height={30}
                                />
                                <p className='text-[#a7e6d7] text-[10px] font-bold'>Opción 2.</p>
                            </div>
                            <p className='font-bold text-gray-text text-sm'>Con medios propios de impresión y termoformado:</p>
                            <p className='text-sm text-gray-text'>Si ya contás con equipos de impresión, te brindamos los archivos STL listos para fabricar los alineadores en tu laboratorio.</p>
                        </div>
                        <div className='space-y-4'>
                            <Image
                                src={Images.mobile.sectionThree.circle4}
                                alt="4"
                                width={30}
                                height={30}
                            />
                            <p className='font-bold text-gray-text text-sm'>Entrega y seguimiento</p>
                            <p className='text-sm text-gray-text'>Te entregamos los alineadores listos para tu paciente y acompañamos el tratamiento con soporte clínico continuo.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionThree
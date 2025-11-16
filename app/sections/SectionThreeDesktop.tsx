import React from 'react'
import CardInsignia from '../components/section-three/card-insignia'
import { Images } from '../images'
import Image from 'next/image'
import { WHATSAPP_LINK } from '../constants'

const SectionThreeDesktop = () => {
  return (
    <div id='hacemos' className='min-h-screen px-8 py-16 relative container mx-auto hidden md:block mt-6'>

      <div className='grid grid-cols-4 gap-16'>
        <div className='max-w-[210px]'>
          <p className='text-blue-text text-3xl leading-8'>Te contamos qué hace <br /><span className='font-bold'>Indigo&reg; <br /> por vos.</span></p>
        </div>
        <div>
          <p className='text-gray-text text-xl leading-6'>Brindamos un servicio integral de diseño y fabricación de alineadores invisibles pensado exclusivamente para ortodoncistas.</p>
        </div>
        <div>
          <p className='text-gray-text text-xl leading-6'>Cada caso se planifica
            con rigurosidad clínica, empleando software
            de vanguardia y materiales certificados, para asegurar resultados predecibles
            y de alta calidad.</p>
        </div>
        <div>
          <p className='text-blue-text text-xl font-bold leading-6'>Nuestro objetivo es que vos te concentres en el paciente, <span className='text-gray-text font-normal'>mientras nosotras nos ocupamos de todo el proceso digital.</span></p>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-16 mt-16'>
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
      <div className='flex justify-center items-center my-16'>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className='cursor-pointer'>
          <Image
            src={Images.desktop.common.btnContactanosGradient}
            alt="Contactanos"
            width={170}
            height={50}
            className="object-cover"
          />
        </a>
      </div>
      <div className='grid grid-cols-4 gap-16'>
        <div className='max-w-[240px]'>
          <p className='text-blue-text text-3xl leading-8'>Te contamos <br />cómo trabajar <br /> con <span className='font-bold'>Indigo&reg;.</span></p>
          <p className='text-gray-text text-xl mt-4'>Es muy simple</p>
        </div>
        <div className='space-y-4'>
          <Image
            src={Images.mobile.sectionThree.circle1}
            alt="1"
            width={30}
            height={30}
          />
          <p className='font-bold text-gray-text text-lg leading-5'>Carga del caso</p>
          <p className='text-lg leading-5 text-gray-text'>Subís los escaneos y la información clínica de tu paciente al portal Indigo.</p>
        </div>
        <div className='space-y-4'>
          <Image
            src={Images.mobile.sectionThree.circle2}
            alt="2"
            width={30}
            height={30}
          />
          <p className='font-bold text-gray-text text-lg leading-5'>Planificación Digital</p>
          <p className='text-lg leading-5 text-gray-text'>Nuestro equipo de ortodoncistas diseña un setup virtual de acuerdo a tus objetivos clínicos.</p>
        </div>
        <div className='space-y-4'>
          <Image
            src={Images.mobile.sectionThree.circle3}
            alt="3"
            width={30}
            height={30}
          />
          <p className='font-bold text-gray-text text-lg leading-5'>Fabricación de alineadores</p>
          <p className=' text-gray-text text-lg leading-5'>Una vez que el plan es aprobado, fabricamos los alineadores con máxima precisión y materiales certificados.</p>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-16 mt-16'>
        <div className='space-y-4'>
          <p className='text-blue-text text-xl font-bold  leading-5'>Primer contacto</p>
          <p className='text-blue-text text-xl leading-5'>El proceso inicia con la solicitud de los registros necesarios para evaluar el caso.</p>
          <p className='text-blue-text text-xl leading-5'>Luego, te compartimos nuestra dinámica de trabajo y los costos correspondientes.</p>
        </div>
        <div className='space-y-4'>
          <Image
            src={Images.mobile.sectionThree.circle3}
            alt="3"
            width={30}
            height={30}
          />
          <p className='font-bold text-gray-text text-lg leading-5'>Sin medios propios de impresión y termoformado:</p>
          <p className='text-lg leading-5 text-gray-text'>Nos ocupamos de todo el proceso. <br className='pt-2' />Planificación, fabricación y entrega de los .</p>
        </div>
        <div className='space-y-4'>
          <Image
            src={Images.mobile.sectionThree.circle3}
            alt="3"
            width={30}
            height={30}
          />
          <p className='font-bold text-gray-text text-lg leading-5'>Con medios propios de impresión y termoformado:</p>
          <p className='text-lg leading-5 text-gray-text'>Si ya contás con equipos de impresión, te brindamos los archivos STL listos para fabricar los alineadores en tu laboratorio.</p>
        </div>
        <div className='space-y-4'>
          <Image
            src={Images.mobile.sectionThree.circle4}
            alt="4"
            width={30}
            height={30}
          />
          <p className='font-bold text-gray-text text-lg leading-5'>Entrega y seguimiento</p>
          <p className='text-lg leading-5 text-gray-text'>Te entregamos los alineadores listos para tu paciente y acompañamos el tratamiento con soporte clínico continuo.</p>
        </div>
      </div>
    </div>
  )
}

export default SectionThreeDesktop

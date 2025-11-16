import React from 'react'
import { Images } from '../images'

const SectionFiveDesktop = () => {
  return (
    <div className="hidden md:block relative w-screen h-[80vh] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${Images.desktop.sectionFive.team})` }}>
        <div className='container mx-auto px-2 py-16 h-full'>
          <p className='text-white font-bold text-xl'>Especialistas y expertas <br /><span className='font-normal'> en Ortodoncia Digital.</span></p>
          <div className='flex h-full justify-end items-end pb-16'>
            <p className='text-white text-xl'><span className='font-bold'>Indigo&reg;</span> alineadores invisibles.</p>
          </div>
        </div>
    </div>
  )
}

export default SectionFiveDesktop
import React from 'react'
import { Images } from '../images'
import Image from 'next/image'

const SectionSeven = () => {
    return (
        <div className='relative w-full px-6 mt-6 md:hidden'>
            <div
                className="h-[200px]  bg-contain bg-no-repeat bg-center flex justify-center items-end text-center mx-auto"
                style={{
                    backgroundImage: `url(${Images.mobile.sectionSix.midCircle})`,
                }}
            >
                <p className="text-xl text-gray-text text-center flex flex-col justify-end">
                    <span className='text-center'>Supervisamos.<br />Acompañamos.</span>
                    <span className='font-bold mt-2 text-center'>Resolvemos.</span>
                </p>
            </div>
            <div className='bg-contain bg-center h-[400px] relative bg-no-repeat flex justify-center items-center'
                style={{
                    backgroundImage: `url(${Images.mobile.sectionSeven.balls})`,
                }}
            >
                <div className=' text-sm max-w-[180px] space-y-2 text-center'>
                    <p className='text-gray-text'>No necesitás grandes inversiones o infraestructura.</p>
                    <p className='text-blue-text font-bold'>Trabajar con alineadores y un equipo de especialistas que domine la Ortodoncia Digital es posible.</p>
                </div>
            </div>
            <div className="mt-4 flex justify-center">
                <button className="cursor-pointer">
                    <Image
                        src={Images.mobile.common.btnEmpeza}
                        alt="Empezar"
                        width={180}
                        height={40}
                    />
                </button>
            </div>
        </div>
    )
}

export default SectionSeven
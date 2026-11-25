import React from 'react'
import { doctorAgent } from './DoctorAgentCard'
import Image from 'next/image'
import { IconH2 } from '@tabler/icons-react'


type props = {
  doctorAgent: doctorAgent
  setSelectedDoctor: any
  selectedDoctor: doctorAgent | undefined 
}

function SuggestedDoctorCard({doctorAgent, setSelectedDoctor, selectedDoctor}: props) {
  return (
    <div 
      className={`flex flex-col items-center border-4 rounded-2xl shadow p-4 hover:border-blue-500 cursor-pointer ${selectedDoctor?.id == doctorAgent.id && 'border-blue-500'}`} 
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image 
        src={doctorAgent.image} 
        alt={doctorAgent.specialist} 
        width={70}
        height={70}
        className='w-70px h-70px rounded-full object-cover'
      />
      <h2 className='font-bold text-sm text-center'>{doctorAgent.specialist}</h2>
      <p className='text-xs text-center line-clamp-2'>{doctorAgent.description}</p>
    </div>
  )
}

export default SuggestedDoctorCard
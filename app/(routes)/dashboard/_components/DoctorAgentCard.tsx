"use client" 
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

export type doctorAgent = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string
  voiceId?: string
}

type props = {
  doctorAgent: doctorAgent
}

function DoctorAgentCard({ doctorAgent }: props) {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const StartConsultation = async () => {
    try {
      setLoading(true)

      // ✅ Create a new session
      const result = await axios.post('/api/session-chat', {
        selectedDoctor: doctorAgent,
        notes: doctorAgent.description,
        userId: user?.id,
      })

      const sessionId = result.data.sessionId

      // ✅ Navigate to the medical agent page
      router.push(`/dashboard/medical-agent/${sessionId}`)

    } catch (err) {
      console.error('Failed to start consultation:', err)
      setLoading(false)
    }
  }

  return (
    <div>
      {doctorAgent.image ? (
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialist}
          width={200}
          height={200}
          className='w-full h-70 object-cover rounded-2xl'
        />
      ) : (
        <Image
          src="/doctor.png"
          alt="default doctor"
          width={200}
          height={200}
          className='w-full h-70 object-cover rounded-2xl'
        />
      )}

      <h2 className='font-extrabold text-lg mt-1'>
        {doctorAgent.specialist}
      </h2>

      <p className='line-clamp-2 text-lg text-gray-500'>
        {doctorAgent.description}
      </p>

      {/* ✅ Button now navigates to medical agent page */}
      <Button
        className='w-full m-2'
        onClick={StartConsultation}
        disabled={loading}
      >
        {loading
          ? <><span className='animate-spin mr-2'>⏳</span> Starting...</>
          : <> Start Consultation <IconArrowRight /></>
        }
      </Button>
    </div>
  )
}

export default DoctorAgentCard
"use client"
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowBigRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'

function AddNewSessionDialog() {
  
  const[selectedDoctor,setSelectedDoctor]=useState<doctorAgent>();
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const [suggestion, setSuggested] = useState<doctorAgent[]>();

  // ✅ Fix hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const OnClickNext = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/suggestion', {
        notes: note
      });

      console.log(result.data);
      setSuggested(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }


  const onStartConsultation=async()=>{
    setLoading(true);
   // save all information to database
   const result=await axios.post('/api/session-chat',{
        notes:note,
        selectedDoctor:selectedDoctor
   });

   console.log(result.data);
   if(result.data?.sessionId)
   {

       console.log(result.data.sessionId);
       //Route new Conversation screen
       router.push('/dashboard/medical-agent/'+result.data.sessionId);
   }
   setLoading(false);

  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mt-3'>+ Start a Consultation</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>

          <DialogDescription asChild>
            {!suggestion ? (
              <div>
                <h2>Add Symptoms or Any Other Details</h2>

                <Textarea
                  placeholder='Add Detail here....'
                  className='h-56 mt-1'
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>Select the Doctor</h2>
              <div className='grid grid-cols-2 gap-5'>
                {suggestion.map((doctor, index) => (
                  <SuggestedDoctorCard doctorAgent={doctor} key={index} 
                  setSelectedDoctor={()=>setSelectedDoctor(doctor)}
                  //@ts-ignore
                  selectedDoctor={selectedDoctor}  />

                ))}
              </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>

          {!suggestion ? (
            <Button
              disabled={!note || loading}
              onClick={OnClickNext}
            >
              {loading && <Loader2 className='animate-spin mr-2' />}
              {loading ? "Loading..." : <>Next <ArrowBigRight /></>}
            </Button>
          ) : (
            <Button 
            disabled={loading||!selectedDoctor}
            onClick={()=>onStartConsultation()}>Start Consultation
            
               {loading && <Loader2 className='animate-spin mr-2' />}
              {loading ? "Loading..." : <>Next <ArrowBigRight /></>}
            </Button>
          )} 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewSessionDialog
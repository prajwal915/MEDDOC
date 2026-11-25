"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff, Replace } from 'lucide-react';
import Image from 'next/image';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string
}

type Message = {
  role: 'assistant' | 'user';
  text: string;
  isFinal: boolean;
}

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [loading, setLoading] = useState(false); 
  const router=useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    const vapi = vapiRef.current;

    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStarted(true);
      setLoading(false); 
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStarted(false);
      setLoading(false); 
      setMessages([]);
    });

    vapi.on('error', (e) => {
      console.error('Vapi error:', e);
      setCallStarted(false);
      setLoading(false); 
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const isFinal = message.transcriptType === 'final';

        setMessages((prev) => {
          const last = prev[prev.length - 1];

          if (last && last.role === message.role && !last.isFinal) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: message.role,
              text: message.transcript,
              isFinal,
            };
            return updated.slice(-30);
          }

          return [
            ...prev,
            { role: message.role, text: message.transcript, isFinal },
          ].slice(-5);
        });
      }
    });

    return () => {
      vapi.stop();
    };
  }, []);

  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  };

  const FIRST_MESSAGE = "Hello! I'm your AI medical assistant. How are you feeling today? Please describe your symptoms and I'll do my best to help.";

  const StartCall = async () => {
    const vapiAgentConfig = {
      name: 'AI MEDICAL DOCTOR VOICE AGENT',
      firstMessage: FIRST_MESSAGE,
      transcriber: {
        provider: 'assembly-ai',
        language: 'en'
      },
      voice: {
        provider: 'vapi',
        voiceId: sessionDetail?.selectedDoctor?.voiceId
      },
      model: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: sessionDetail?.selectedDoctor?.agentPrompt
          }
        ]
      }
    };

    try {
      setLoading(true); 
      setCallStarted(true);
      setMessages([{
        role: 'assistant',
        text: FIRST_MESSAGE,
        isFinal: true,
      }]);
      //@ts-ignore
      await vapiRef.current?.start(vapiAgentConfig);
    } catch (err) {
      console.error('Failed to start call:', err);
      setCallStarted(false);
      setLoading(false);
      setMessages([]);
    }
  };

  const EndCall = async() => {
    setLoading(true); 
    vapiRef.current?.stop();
    const result=await GenerateReport();

    setLoading(false);
    toast.success('Your report is generated!');

    router.replace('/dashboard');
  };

  const GenerateReport=async()=>{
    const result=await axios.post('/api/medical-report',{
      messages:messages,
      sessionDetail:sessionDetail,
      sessionId:sessionId
    })

    console.log(result.data);
    return result.data;
  }

  return (
    <div className='p-7 border-6 rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1.5 px-2 border rounded-b-md flex gap-2 items-center'>
          <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
          {callStarted ? 'Connected...' : 'Not Connected'}
        </h2>
        
      </div>

      {sessionDetail && (
        <div className='flex items-center flex-col mt-10'>
          <Image
            src={sessionDetail.selectedDoctor.image}
            alt={sessionDetail.selectedDoctor.specialist ?? ''}
            width={120}
            height={120}
            className='h-27 w-27 object-cover rounded-full'
          />
          <h2 className='mt-2 text-lg text-blue-700'>{sessionDetail.selectedDoctor.specialist}</h2>
          <p className='text-sm text-gray-400'>AI_MED_DOC</p>

          {/* Conversation Display */}
          <div className='mt-10 w-full px-4 space-y-2 min-h-12.5'>
            {messages.length === 0 && callStarted && (
              <p className='text-center text-gray-400 text-sm'>Listening...</p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm transition-all duration-300
                    ${msg.role === 'assistant' ? 'bg-blue-100' : 'bg-gray-100'}
                    ${!msg.isFinal
                      ? 'font-bold text-black'
                      : 'font-normal text-gray-400'
                    }`}
                >
                  <span className='text-lg block mb-1 opacity-60'>
                    {msg.role === 'assistant' ? '🩺 Doctor' : '🧑 You'}
                  </span>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {!callStarted
            ? <Button className='mt-10' onClick={StartCall} disabled={loading}>
                {loading
                  ? <><span className='animate-spin mr-2'>⏳</span> Connecting...</>
                  : <><PhoneCall className='mr-2' /> Start Call</>
                }
              </Button>
            : <Button variant='destructive' onClick={EndCall} disabled={loading}>
                {loading
                  ? <><span className='animate-spin mr-2'>⏳</span> Disconnecting...</>
                  : <><PhoneOff className='mr-2' /> Disconnect</>
                }
              </Button>
          }
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { doctorAgent } from './DoctorAgentCard'
import {
  FileText, User, Stethoscope, Clock, AlertCircle,
  BookOpen, Pill, CheckCircle2, Activity, Calendar, Shield
} from 'lucide-react'

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: any,
  selectedDoctor: doctorAgent,
  createdOn: string
}

type Props = {
  record: SessionDetail
}

function ViewReportDialog({ record }: Props) {

  const report = typeof record?.report === 'string'
    ? JSON.parse(record.report)
    : record?.report;

  console.log('Full report:', JSON.stringify(report, null, 2));

  const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
    severe:   { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
    moderate: { color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    mild:     { color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  };
  const severity = severityConfig[report?.severity?.toLowerCase()] ?? severityConfig['mild'];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 gap-1'
        >
          <FileText className='h-3.5 w-3.5' />
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl'>

        {/* ── Header ── */}
        <div className='relative bg-linear-to-br from-blue-700 via-blue-500 to-cyan-400 px-10 py-8 rounded-t-2xl overflow-hidden'>
          <div className='absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10' />
          <div className='absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/10' />

          <DialogHeader>
            <DialogTitle asChild>
              <div className='relative flex items-center gap-4'>
                <div className='bg-white/20 backdrop-blur-sm p-3.5 rounded-2xl border border-white/30'>
                  <Stethoscope className='h-8 w-8 text-white' />
                </div>
                <div>
                  <p className='text-blue-100 text-xs font-medium uppercase tracking-widest mb-1'>
                    AI Medical Consultation
                  </p>
                  <h2 className='text-3xl font-bold text-white'>Medical Report</h2>
                  <div className='flex items-center gap-2 mt-1.5'>
                    <Calendar className='h-3.5 w-3.5 text-blue-200' />
                    <p className='text-blue-100 text-sm'>
                      {new Date(record.createdOn).toLocaleString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Severity Badge */}
                {report?.severity && (
                  <div className={`ml-auto px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${severity.bg} ${severity.color} ${severity.border}`}>
                    {report.severity}
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className='px-10 py-8 space-y-8 bg-gray-50'>

          {/* ── Info Cards ── */}
          <div className='grid grid-cols-2 gap-4'>
            <InfoCard
              icon={<Stethoscope className='h-5 w-5 text-blue-600' />}
              iconBg='bg-blue-100'
              cardBg='bg-white'
              label='Doctor'
              value={record.selectedDoctor?.specialist ?? '—'}
            />
            <InfoCard
              icon={<User className='h-5 w-5 text-purple-600' />}
              iconBg='bg-purple-100'
              cardBg='bg-white'
              label='Patient'
              // ✅ Reads "user" field which the AI now correctly extracts
              value={report?.user ?? report?.patientName ?? 'Anonymous'}
            />
            <InfoCard
              icon={<Clock className='h-5 w-5 text-orange-500' />}
              iconBg='bg-orange-100'
              cardBg='bg-white'
              label='Duration'
              value={report?.duration ?? report?.symptomDuration ?? 'Not specified'}
            />
            <InfoCard
              icon={<Shield className='h-5 w-5 text-green-600' />}
              iconBg='bg-green-100'
              cardBg='bg-white'
              label='Agent'
              value={report?.agent ?? (record.selectedDoctor?.specialist + ' AI')}
            />
          </div>

          {/* ── Chief Complaint ── */}
          {report?.chiefComplaint && (
            <Section
              icon={<AlertCircle className='h-5 w-5' />}
              title='Chief Complaint'
              gradient='from-red-500 to-rose-400'
            >
              <p className='text-gray-600 text-sm leading-relaxed bg-white rounded-xl p-4 border border-red-100'>
                {report.chiefComplaint}
              </p>
            </Section>
          )}

          {/* ── Summary ── */}
          {report?.summary && (
            <Section
              icon={<BookOpen className='h-5 w-5' />}
              title='Summary'
              gradient='from-blue-500 to-cyan-400'
            >
              <p className='text-gray-600 text-sm leading-relaxed bg-white rounded-xl p-4 border border-blue-100'>
                {report.summary}
              </p>
            </Section>
          )}

          {/* ── Symptoms ── */}
          {report?.symptoms?.length > 0 && (
            <Section
              icon={<Activity className='h-5 w-5' />}
              title='Symptoms'
              gradient='from-purple-500 to-violet-400'
            >
              <div className='flex flex-wrap gap-2'>
                {report.symptoms.map((s: string, i: number) => (
                  <span key={i} className='bg-white text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full border border-purple-200 shadow-sm'>
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* ── Medications ── */}
          {report?.medicationsMentioned?.length > 0 && (
            <Section
              icon={<Pill className='h-5 w-5' />}
              title='Medications Mentioned'
              gradient='from-orange-500 to-amber-400'
            >
              <div className='flex flex-wrap gap-2'>
                {report.medicationsMentioned.map((m: string, i: number) => (
                  <span key={i} className='bg-white text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full border border-orange-200 shadow-sm'>
                    {m}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* ── Recommendations ── */}
          {report?.recommendations?.length > 0 && (
            <Section
              icon={<CheckCircle2 className='h-5 w-5' />}
              title='Recommendations'
              gradient='from-green-500 to-emerald-400'
            >
              <ul className='space-y-2'>
                {report.recommendations.map((r: string, i: number) => (
                  <li key={i} className='flex items-start gap-3 bg-white text-sm text-gray-600 px-4 py-3 rounded-xl border border-green-100 shadow-sm'>
                    <CheckCircle2 className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                    {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ── No Report Fallback ── */}
          {!report && (
            <div className='text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200'>
              <FileText className='h-14 w-14 text-gray-200 mx-auto mb-4' />
              <p className='text-gray-400 text-sm font-medium'>No report available for this session.</p>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}


function InfoCard({
  icon, iconBg, cardBg, label, value
}: {
  icon: React.ReactNode;
  iconBg: string;
  cardBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className={`${cardBg} rounded-xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm`}>
      <div className={`${iconBg} p-2.5 rounded-xl`}>{icon}</div>
      <div>
        <p className='text-xs text-gray-400 font-medium uppercase tracking-widest'>{label}</p>
        <p className='text-sm font-semibold text-gray-800 mt-0.5'>{value}</p>
      </div>
    </div>
  )
}


function Section({
  title, children, icon, gradient
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <div className={`bg-linear-to-r ${gradient} p-1.5 rounded-lg text-white`}>
          {icon}
        </div>
        <h3 className='font-bold text-gray-700 text-base'>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default ViewReportDialog
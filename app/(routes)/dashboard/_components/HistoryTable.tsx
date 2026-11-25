import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { doctorAgent } from './DoctorAgentCard'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import ViewReportDailog from './ViewReportDailog'

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string
}

type Props = {
  historyList: SessionDetail[]
}

function HistoryTable({ historyList }: Props) {
  return (
    <div className='rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50 hover:bg-gray-50'>
            <TableHead className='w-48 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              AI Medical Specialist
            </TableHead>
            <TableHead className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Description
            </TableHead>
            <TableHead className='w-40 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Date
            </TableHead>
            <TableHead className='w-32 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList?.length > 0 ? (
            historyList.map((record: SessionDetail, index: number) => (
              <TableRow
                key={index}
                className='border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150'
              >
                <TableCell className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold'>
                      {record.selectedDoctor.specialist?.charAt(0)}
                    </div>
                    <span className='font-medium text-gray-800 text-sm'>
                      {record.selectedDoctor.specialist}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                  {record.notes ?? '—'}
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500'>
                  {new Date(record.createdOn).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className='px-6 py-4 text-right'>
                  <ViewReportDailog record={record}/>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='px-6 py-12 text-center text-gray-400 text-sm'>
                No consultation history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption className='pb-4 text-xs text-gray-400'>
          Previous Consultation Reports
        </TableCaption>
      </Table>
    </div>
  )
}

export default HistoryTable
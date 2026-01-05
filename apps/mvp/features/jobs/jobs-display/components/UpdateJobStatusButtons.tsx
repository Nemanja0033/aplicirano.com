"use client"
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthProvider';
import { updateRecordsStatus, deleteRecords } from '@/features/jobs/jobs-display/services/batch-actions-service';

const UpdateJobStatusButtons = ({ selectedRows }: { selectedRows: string[]}) => {
  const { token } = useAuthContext();
  return (
    <div className="w-full mt-3 grid gap-2 items-center justify-between">
        <span className="font-medium">Selected Records ({selectedRows.length})</span>
        <div className="md:flex grid grid-cols-2 gap-2 items-center">
            <Button size={'sm'} type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "INTERVIEW", token as any); location.reload()}} variant={'outline'}>Mark As Interview</Button>
            <Button size={'sm'} type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "REJECTED", token as any); location.reload()}} variant={'outline'}>Mark As Rejected</Button>
            <Button size={'sm'} type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "OFFER", token as any); location.reload();}} variant={'outline'}>Mark As Offer</Button>
            <Button size={'sm'} type="button" onClick={async () => {await deleteRecords(selectedRows, token as any); location.reload();}} variant={'destructive'}>Delete {selectedRows.length} records</Button>
        </div>
    </div>
  )
}

export default UpdateJobStatusButtons
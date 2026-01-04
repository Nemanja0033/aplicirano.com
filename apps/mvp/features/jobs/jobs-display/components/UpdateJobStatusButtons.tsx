import { Button } from '@/components/ui/button';
import { updateRecordsStatus, deleteRecords } from '@/features/jobs/jobs-display/services/batch-actions-service';

const UpdateJobStatusButtons = ({ selectedRows }: { selectedRows: string[]}) => {
  return (
    <div className="w-full mt-3 grid gap-2 items-center justify-between">
        <span className="font-medium">Selected Records ({selectedRows.length})</span>
        <div className="md:flex grid grid-cols-2 gap-2 items-center">
            <Button size={'sm'} type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "INTERVIEW"); location.reload()}} variant={'outline'}>Mark As Interview</Button>
            <Button size={'sm'} type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "REJECTED"); location.reload()}} variant={'outline'}>Mark As Rejected</Button>
            <Button size={'sm'} type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "OFFER"); location.reload();}} variant={'outline'}>Mark As Offer</Button>
            <Button size={'sm'} type="button" onClick={async () => {await deleteRecords(selectedRows); location.reload();}} variant={'destructive'}>Delete {selectedRows.length} records</Button>
        </div>
    </div>
  )
}

export default UpdateJobStatusButtons
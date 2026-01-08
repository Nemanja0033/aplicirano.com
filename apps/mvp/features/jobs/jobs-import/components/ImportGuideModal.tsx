import { AlertDialogHeader, AlertDialogFooter, AlertDialogContent } from '@/components/ui/alert-dialog'
import { AlertDialog, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import { Info } from 'lucide-react';
import { useState } from 'react';

const ImportGuideModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <button type="button" onClick={() => setIsModalOpen(true)} className="dark:text-gray-400 text-xs md:flex hidden gap-1 hover:underline cursor-pointer items-center"><Info size={14} /> Guide</button>
    <AlertDialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>How to import applied jobs?</AlertDialogTitle>
            <AlertDialogDescription>
            <b>IMPORTING .txt FILE</b> <br />
            <span className='dark:text-gray-400'>
            1. In order to import the applied jobs, <b>please click on the "Import" button.</b> <br /> <br />
            2. And select the .txt document that contains the names of the companies you recently applied to. <br /> <br />
            <b>**IMPORTANT** Please put a "-" character between each job title/company name.</b> <br /><br />
            </span>
            <b>MANUAL IMPORT</b>
            <br /><br />
            <span className='dark:text-gray-400'>
              1. Click "+ Manuel Import" button. <br /><br />
              2. When modal is open, enter company name and select applied date.
            </span>
            
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer bg-primary p-2 rounded-lg shadow-md'>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default ImportGuideModal
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label";
import { postSingleJob } from "../services/job-import-service";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useQueryClient } from "@tanstack/react-query";

export interface JobImportForm {
  company: string;
  appliedAt: Date;
}

const ManuelJobImport = ({ isDisabled }: { isDisabled: boolean }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user, token } = useFirebaseUser();
  const { 
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
   } = useForm<JobImportForm>({ mode: "onSubmit" });

  const handleSubmitJob = async (data: JobImportForm) => {
    try{
      const jobObject = { company: data.company, appliedAt: date }
      await postSingleJob(jobObject, token);
      queryClient.invalidateQueries({ queryKey: ['jobs', user?.email]})
      setIsModalOpen(false);
    }
    catch(err){
      console.error(err);
    }
  } 

  return (
    <>
        <Button type="button" disabled={isDisabled} onClick={() => setIsModalOpen(true)}>+ Add Job</Button>
        <AlertDialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Import Job Application</AlertDialogTitle>
            </AlertDialogHeader>
          <form onSubmit={handleSubmit(handleSubmitJob)} className="grid gap-2">
                <Label htmlFor="company" className="text-xs dark:text-gray-400">*Company name</Label>
                <Input {...register("company" , {
                  required: {
                    value: true,
                    message: "Company name is reqiured"
                  },
                  minLength:{
                    value: 2,
                    message: "Company name require minimum 2 characters"
                  },
                  maxLength: {
                    value: 35,
                    message: "Company name accepts maximum 15 characters"
                  }
                })} id="company" className="w-full" />

                {errors.company && <span className="text-red-500 text-xs">*{errors.company.message}</span>}

                <Label htmlFor="appliedAt" className="text-xs dark:text-gray-400">*Applied at</Label>
                <Calendar
                id="appliedAt"
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full border shadow-sm"
                captionLayout="dropdown"
                />
                <div className="flex gap-2 w-full justify-end">
                  <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting. . ." : "Submit"}</Button>
                  <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                </div>
            </form>
            <AlertDialogFooter>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default ManuelJobImport
"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { postSingleJob } from "../services/job-import-service";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export interface JobImportForm {
  company: string;
  appliedAt: Date;
}

// *TODO* Refactor, avoid any type casting!

const ManuelJobImport = ({
  isDisabled,
  currentUser,
}: {
  isDisabled: boolean;
  currentUser: any;
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user, token } = useFirebaseUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobImportForm>({ mode: "onSubmit" });

  const handleSubmitJob = async (data: JobImportForm) => {
    try {
      const jobObject = { company: data.company, appliedAt: date };
      await postSingleJob(jobObject, token);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isOutOfCredits = isDisabled || currentUser.jobsLimit === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              disabled={isOutOfCredits}
              onClick={() => setIsModalOpen(true)}
            >
              + Add Job
            </Button>
          </span>
        </TooltipTrigger>
        {isOutOfCredits && (
          <TooltipContent className="bg-background text-black dark:text-white">
            Nemate više kredita za poslove...
          </TooltipContent>
        )}
      </Tooltip>

      <AlertDialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Job Application</AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit(handleSubmitJob)} className="grid gap-2">
            <Label
              htmlFor="company"
              className="text-xs dark:text-gray-400"
            >
              *Company name
            </Label>
            <Input
              {...register("company", {
                required: {
                  value: true,
                  message: "Company name is required",
                },
                minLength: {
                  value: 2,
                  message: "Company name requires minimum 2 characters",
                },
                maxLength: {
                  value: 35,
                  message: "Company name accepts maximum 35 characters",
                },
              })}
              id="company"
              className="w-full"
            />

            {errors.company && (
              <span className="text-red-500 text-xs">
                *{errors.company.message}
              </span>
            )}

            <Label
              htmlFor="appliedAt"
              className="text-xs dark:text-gray-400"
            >
              *Applied at
            </Label>
            <Calendar
              id="appliedAt"
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full border shadow-sm"
              captionLayout="dropdown"
            />
            <div className="flex gap-2 w-full justify-end">
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
            </div>
          </form>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ManuelJobImport;

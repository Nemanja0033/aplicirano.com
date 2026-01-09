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
import { Textarea } from "@/components/ui/textarea";

export interface JobImportForm {
  company: string;
  appliedAt: Date;
  position: string;
  jobUrl: string;
  salary: number
  location: string
  notes: string
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
      console.log(data);
      const jobObject = { ...data, appliedAt: date };
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
            <div className="grid gap-2 overflow-auto h-[200px]">
              <div className="grid gap-1">
                <Label htmlFor="company" className="text-xs dark:text-gray-400">
                  *Company name <span className="text-xs text-primary">*Required</span>
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
                      value: 50,
                      message: "Company name accepts maximum 35 characters",
                    },
                  })}
                  id="company"
                  className="w-full"
                />

                {errors.company && (
                  <span className="text-red-500 text-xs">
                    *{errors.company?.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="position" className="text-xs dark:text-gray-400">
                  *Position
                </Label>
                <Input
                  {...register("position", {
                    required: false,
                    minLength: {
                      value: 2,
                      message: "Position requires minimum 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Position accepts maximum 35 characters",
                    },
                  })}
                  id="position"
                  className="w-full"
                />

                {errors.position && (
                  <span className="text-red-500 text-xs">
                    *{errors.position.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="url" className="text-xs dark:text-gray-400">
                  *Salarly
                </Label>
                <Input
                  {...register("salary", {
                    required: false,
                    min: 50,
                    max: 30000
                  })}
                  id="url"
                  type="number"
                  className="w-full"
                />

                {errors.salary && (
                  <span className="text-red-500 text-xs">
                    *{errors.salary.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="url" className="text-xs dark:text-gray-400">
                  *Job Url
                </Label>
                <Input
                  {...register("jobUrl", {
                    required: false,
                    minLength: {
                      value: 2,
                      message: "Please enter valid URL",
                    },
                    maxLength: {
                      value: 250,
                      message: "Please enter valid URL",
                    },
                  })}
                  id="url"
                  className="w-full"
                />

                {errors.jobUrl && (
                  <span className="text-red-500 text-xs">
                    *{errors.jobUrl.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="location" className="text-xs dark:text-gray-400">
                  *Location
                </Label>
                <Input
                  {...register("location", {
                    required: false,
                    maxLength: {
                      value: 250,
                      message: "Please enter valid location",
                    },
                  })}
                  id="location"
                  className="w-full"
                />

                {errors.location && (
                  <span className="text-red-500 text-xs">
                    *{errors.location.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="notes" className="text-xs dark:text-gray-400">
                  *Notes
                </Label>
                <Textarea
                  {...register("notes", {
                    required: false,
                    maxLength: {
                      value: 500,
                      message: "Notes can contains maximum 500 chars",
                    },
                  })}
                  id="notes"
                  className="w-full min-h-20 max-h-40"
                />

                {errors.notes && (
                  <span className="text-red-500 text-xs">
                    *{errors.notes.message}
                  </span>
                )}
              </div>
            </div>

            <Label htmlFor="appliedAt" className="text-xs dark:text-gray-400">
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

"use client";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const initialFormState = {
  isSubmitting: false,
  isError: false,
  errorMessage: "",
  fileName: "",
};

export function FileImportForm({
  isDisabled,
  type,
  currentUser,
}: {
  isDisabled: boolean;
  type: "TXT" | "CSV";
  currentUser: any;
}) {
  const [formState, setFormState] = useState(initialFormState);
  const queryClient = useQueryClient();
  const { token } = useFirebaseUser();
  const [isSubmitButtonHidden, setIsSubmitButtonHidden] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "TXT") {
      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      const form = e.currentTarget;
      const fileInput = form.elements.namedItem("text") as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        setFormState({
          isSubmitting: false,
          isError: true,
          errorMessage: "No file selected",
          fileName: "",
        });
        return;
      }

      const formData = new FormData();
      formData.append("text", file);

      try {
        const res = await fetch("/api/jobs", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          const message =
            typeof errorData?.error === "string"
              ? errorData.error
              : "Upload failed";
          throw new Error(message);
        }

        setFormState((prev) => ({ ...prev, isSubmitting: false }));
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["me"] });
        setIsSubmitButtonHidden(true);
      } catch (err: any) {
        setFormState({
          isSubmitting: false,
          isError: true,
          errorMessage: err.message || "Unexpected error",
          fileName: "",
        });
      }
    } else {
      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      const form = e.currentTarget;
      const fileInput = form.elements.namedItem("csv-file") as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        setFormState({
          isSubmitting: false,
          isError: true,
          errorMessage: "No file selected",
          fileName: "",
        });
        return;
      }

      const formData = new FormData();
      formData.append("csv-file", file);

      try {
        const res = await fetch("/api/csv-import", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          const message =
            typeof errorData?.error === "string"
              ? errorData.error
              : "Upload failed";
          throw new Error(message);
        }

        setFormState((prev) => ({ ...prev, isSubmitting: false }));
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["me"] });
        setIsSubmitButtonHidden(true);
      } catch (err: any) {
        setFormState({
          isSubmitting: false,
          isError: true,
          errorMessage: err.message || "Unexpected error",
          fileName: "",
        });
      }
    }
  };

  const isOutOfCredits = isDisabled || currentUser.jobsLimit === 0;

  return (
    <TooltipProvider>
      <form
        onSubmit={handleFormSubmit}
        className="flex justify-between items-center gap-2"
      >
        <div className="items-center gap-2 flex">
          <input
            ref={fileInputRef}
            onChange={() => setIsSubmitButtonHidden(false)}
            disabled={isOutOfCredits}
            type="file"
            accept={type === "TXT" ? ".txt" : ".csv"}
            name={type === "TXT" ? "text" : "csv-file"}
            className="hidden"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  type="button"
                  disabled={isOutOfCredits}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload />
                  {type === "CSV" ? "Import CSV" : "Import TXT"}
                </Button>
              </span>
            </TooltipTrigger>
            {isOutOfCredits && (
              <TooltipContent className="bg-background dark:text-white text-black p-3">
                Nemate više kredita za poslove...
              </TooltipContent>
            )}
          </Tooltip>

          {!isSubmitButtonHidden && (
            <Button
              type="submit"
              disabled={formState.isSubmitting || isDisabled}
            >
              {formState.isSubmitting ? "Uploading..." : "Submit"}
            </Button>
          )}
        </div>
        {formState.isError && (
          <span className="text-red-500 text-sm ml-2">
            {formState.errorMessage}
          </span>
        )}
      </form>
    </TooltipProvider>
  );
}

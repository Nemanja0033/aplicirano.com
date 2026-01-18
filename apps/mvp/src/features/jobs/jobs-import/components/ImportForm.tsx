"use client";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/src/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
  selectedProfile,
  selectedResume,
}: {
  isDisabled: boolean;
  type: "TXT" | "CSV";
  currentUser: any;
  selectedProfile: any;
  selectedResume: any
}) {
  const t = useTranslations("FileImport");
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
          errorMessage: t("error_no_file"),
          fileName: "",
        });
        toast.error(t("error_no_file"));
        return;
      }

      // Here send data to server
      const formData = new FormData();
      formData.append("text", file);
      formData.append("profileId", selectedProfile);
      formData.append("resumeId", selectedResume);

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
              : t("error_upload_failed");
          toast.error(t("error_upload_failed"))
        }

        setFormState((prev) => ({ ...prev, isSubmitting: false }));
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["me"] });
        setIsSubmitButtonHidden(true);
      } catch (err: any) {
        setFormState({
          isSubmitting: false,
          isError: true,
          errorMessage: err.message || t("error_unexpected"),
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
          errorMessage: t("error_no_file"),
          fileName: "",
        });
        toast.error("No file selected")
        return;
      }

      const formData = new FormData();
      formData.append("csv-file", file);
      formData.append("profileId", selectedProfile);
      formData.append("resumeId", selectedResume);

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
              : t("error_upload_failed");
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
          errorMessage: err.message || t("error_unexpected"),
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
                  {type === "CSV"
                    ? t("button_import_csv")
                    : t("button_import_txt")}
                </Button>
              </span>
            </TooltipTrigger>
            {isOutOfCredits && (
              <TooltipContent className="bg-background dark:text-white text-black p-3">
                {t("tooltip_out_of_credits")}
              </TooltipContent>
            )}
          </Tooltip>

          {!isSubmitButtonHidden && (
            <Button
              type="submit"
              disabled={formState.isSubmitting || isDisabled}
            >
              {formState.isSubmitting
                ? t("button_submit_uploading")
                : t("button_submit")}
            </Button>
          )}
        </div>
        {/* {formState.isError && (
          <span className="text-red-500 text-sm ml-2">
            {formState.errorMessage}
          </span>
        )} */}
      </form>
    </TooltipProvider>
  );
}

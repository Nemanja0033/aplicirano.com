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
  selectedResume: any;
}) {
  const t = useTranslations("FileImport");
  const [formState, setFormState] = useState(initialFormState);
  const queryClient = useQueryClient();
  const { token } = useFirebaseUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error(t("error_no_file"));
      return;
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    const formData = new FormData();
    formData.append(type === "TXT" ? "text" : "csv-file", file);
    formData.append("profileId", selectedProfile);
    formData.append("resumeId", selectedResume);

    try {
      const res = await fetch(type === "TXT" ? "/api/jobs" : "/api/csv-import", {
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
        toast.error(message);
      }

      setFormState((prev) => ({ ...prev, isSubmitting: false }));
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err: any) {
      setFormState({
        isSubmitting: false,
        isError: true,
        errorMessage: err.message || t("error_unexpected"),
        fileName: "",
      });
      toast.error(err.message || t("error_unexpected"));
    }
    finally{
      e.target.value = "";
    }
  };

  const isOutOfCredits = isDisabled || currentUser.jobsLimit === 0;

  return (
    <TooltipProvider>
      <div className="flex justify-between items-center gap-2">
        <div className="items-center gap-2 flex">
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
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
                  disabled={isOutOfCredits || formState.isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload />
                  {formState.isSubmitting
                    ? t("button_submit_uploading")
                    : type === "CSV"
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
        </div>
      </div>
    </TooltipProvider>
  );
}

"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { usePurchaseModal } from "../../../../store/purchase-store";

const initialFormState = {
  isSubmitting: false,
  isError: false,
  errorMessage: "",
  fileName: "",
};

export function FileImportForm({
  isDisabled,
  currentUser,
  selectedProfile,
  selectedResume,
}: {
  isDisabled: boolean;
  currentUser: any;
  selectedProfile: any;
  selectedResume: any;
}) {
  const t = useTranslations("FileImport");
  const [formState, setFormState] = useState(initialFormState);
  const queryClient = useQueryClient();
  const { token } = useFirebaseUser();

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const txtInputRef = useRef<HTMLInputElement | null>(null);

  const { openModal } = usePurchaseModal();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "CSV" | "TXT"
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error(t("error_no_file"));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      fileName: file.name,
    }));

    const formData = new FormData();
    formData.append(type === "TXT" ? "text" : "csv-file", file);
    formData.append("profileId", selectedProfile);
    formData.append("resumeId", selectedResume);

    try {
      const res = await fetch(
        type === "TXT" ? "/api/jobs" : "/api/csv-import",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const message =
          typeof errorData?.error === "string"
            ? errorData.error
            : t("error_upload_failed");

        toast.error(message);

        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));

        return; // ← BITNO
      }

      toast.success("File uploaded successfully");

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });

      setFormState(initialFormState);
    } catch (err: any) {
      setFormState({
        isSubmitting: false,
        isError: true,
        errorMessage: err.message || t("error_unexpected"),
        fileName: "",
      });

      toast.error(err.message || t("error_unexpected"));
    } finally {
      e.target.value = "";
    }
  };

  // When user if run off credits call purhcase modal CTA
  const isOutOfCredits = isDisabled || currentUser.jobsLimit === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          // disabled={isOutOfCredits || formState.isSubmitting}
        >
          <Upload className="mr-2 h-4 w-4" />
          {formState.isSubmitting ? t("button_submit_uploading") : "Import"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="grid gap-3 p-3">
        {/* Hidden inputs */}
        <input
          ref={csvInputRef}
          onChange={(e) => {
            if (isDisabled || currentUser.jobsLimit === 0) {
              openModal();
              return;
            }
            handleFileChange(e, "CSV");
          }}
          type="file"
          accept=".csv"
          name="csv-file"
          className="absolute w-0 h-0 opacity-0"
        />

        <input
          ref={txtInputRef}
          onChange={(e) => handleFileChange(e, "TXT")}
          type="file"
          accept=".txt"
          name="text"
          className="absolute w-0 h-0 opacity-0"
        />

        {/* Dropdown items */}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (isDisabled || currentUser.jobsLimit === 0) {
              openModal();
              return;
            }
            csvInputRef.current?.click();
          }}
          // disabled={isOutOfCredits}
        >
          Upload CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (isDisabled || currentUser.jobsLimit === 0) {
              openModal();
              return;
            }
            txtInputRef.current?.click();
          }}
          // disabled={isOutOfCredits}
        >
          Upload TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

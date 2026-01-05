"use client";
import { useState } from "react";
import { Info, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

const initialFormState = {
  isSubmitting: false,
  isError: false,
  errorMessage: "",
  fileName: "",
};

// TODO avoid any use proper type for currentUser

export function FileImportForm({
  isDisabled,
  type,
  currentUser
}: {
  isDisabled: boolean;
  type: "TXT" | "CSV";
  currentUser: any
}) {
  const [formState, setFormState] = useState(initialFormState);
  const queryClient = useQueryClient();
  const { token } = useFirebaseUser();
  const [isSubmitButtonHidden, setIsSubmitButtonHidden] = useState(true);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "TXT") {
      setFormState((perv) => ({ ...perv, isSubmitting: true }));

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

      // get current user and token
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

        setFormState((perv) => ({ ...perv, isSubmitting: false }));
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
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
      setFormState((perv) => ({ ...perv, isSubmitting: true }));

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

      // get current user and token
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

        setFormState((perv) => ({ ...perv, isSubmitting: false }));
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
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

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="flex justify-between items-center gap-2"
      >
        {/* <span className="flex gap-2 text-xs text-gray-400 items-center"><Info size={15} /> Supported files to import is .txt files, and must contain "-" between each job title.</span> */}

        <div className="items-center gap-2 flex">
          <input
            onChange={() => setIsSubmitButtonHidden(false)}
            disabled={isDisabled || currentUser.jobsLimit === 0}
            type="file"
            id={type === "TXT" ? "text" : "csv-file"}
            accept={type === "TXT" ? ".txt" : ".csv"}
            className="hidden"
            name={type === "TXT" ? "text" : "csv-file"}
          />
          <label htmlFor={type === "TXT" ? "text" : "csv-file"}>
            <Button
              disabled={isDisabled || currentUser.jobsLimit === 0}
              className={`${isDisabled && "opacity-50"}`}
              type="button"
            >
                <Upload /> {type === "CSV" ? "Import CSV" : "Import TXT"}
            </Button>
          </label>

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
    </>
  );
}

"use client";
import { Button } from "@/src/components/ui/button";
import { useAuthContext } from "@/src/context/AuthProvider";
import {
  updateRecordsStatus,
  deleteRecords,
} from "@/src/features/jobs/jobs-display/services/batch-actions-service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const UpdateJobStatusButtons = ({ selectedRows, resetRows }: { selectedRows: string[], resetRows: () => void }) => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "INTERVIEW" | "REJECTED" | "OFFER" | "DELETE" | null
  >(null);
  const t = useTranslations("JobsTable");

  async function handleUpdateStatus(status: "INTERVIEW" | "REJECTED" | "OFFER") {
    try {
      setIsLoading(true);
      setLoadingAction(status);
      await updateRecordsStatus(selectedRows, status, token as any);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ['me']})
      resetRows();
    } catch (err) {
      toast.error("Something went wrong while updating status");
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }

  async function handleDeleteRecords() {
    try {
      setIsLoading(true);
      setLoadingAction("DELETE");
      await deleteRecords(selectedRows, token as any);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ['me']})
      resetRows();
    } catch (err) {
      toast.error("Something went wrong while deleting records");
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }

  return (
    <div className="w-full mt-3 grid gap-2 items-center justify-between">
      <span className="font-medium">
        Selected Records ({selectedRows.length})
      </span>
      <div className="md:flex grid grid-cols-2 gap-2 items-center">
        <Button onClick={resetRows}>
          {t("cancel")}
        </Button>
        <Button
          size="sm"
          type="button"
          onClick={() => handleUpdateStatus("INTERVIEW")}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading && loadingAction === "INTERVIEW"
            ? <span><Loader2 className="animate-spin" /></span>
            : t("mark_as_interview")}
        </Button>

        <Button
          size="sm"
          type="button"
          onClick={() => handleUpdateStatus("REJECTED")}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading && loadingAction === "REJECTED"
            ? <span><Loader2 className="animate-spin" /></span>
            : t("mark_as_rejected")}
        </Button>

        <Button
          size="sm"
          type="button"
          onClick={() => handleUpdateStatus("OFFER")}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading && loadingAction === "OFFER"
            ? <span><Loader2 className="animate-spin" /></span>
            : t("mark_as_offer")}
        </Button>

        <Button
          size="sm"
          type="button"
          onClick={handleDeleteRecords}
          variant="destructive"
          disabled={isLoading}
        >
          {isLoading && loadingAction === "DELETE"
            ? <span><Loader2 className="animate-spin" /></span>
            : `${t("delete_button")} (${selectedRows.length})`}
        </Button>
      </div>
    </div>
  );
};

export default UpdateJobStatusButtons;

import { AlertDialogCancel, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/src/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Job } from "../types";
import { Button } from "@/src/components/ui/button";

interface DeleteJobModal {
  selectedJob: Job;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  onConfirm: any
}

export default function DeleteJobModal({
  selectedJob,
  isOpen,
  isDeleting,
  onConfirm,
  onOpenChange,
}: DeleteJobModal) {
    const t = useTranslations("JobsTable");

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_modal_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-3 font-medium">
                  {t("delete_modal_message")} {selectedJob?.title}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="cursor-pointer bg-muted p-2 rounded-lg">
              {t("delete_modal_close")}
            </AlertDialogCancel>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("delete_modal_action")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
}

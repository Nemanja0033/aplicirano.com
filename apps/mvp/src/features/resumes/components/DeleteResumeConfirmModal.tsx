import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

interface DeleteResumeConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResume: { id: string; title?: string } | null;
  isDeleting: boolean;
  onConfirm: () => void;
}

export const DeleteResumeConfirmModal = ({
  open,
  onOpenChange,
  selectedResume,
  isDeleting,
  onConfirm,
}: DeleteResumeConfirmModalProps) => {
  const t = useTranslations("ResumePage");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirm_delete_title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("confirm_delete_desc")}
            <div className="mt-3 font-medium">
              {selectedResume?.title
                ? `${t("confirm_delete_resume_label")}: ${selectedResume.title}`
                : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel className="cursor-pointer bg-muted p-2 rounded-lg">
            {t("confirm_delete_cancel")}
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? t("confirm_delete_deleting") : t("confirm_delete_confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

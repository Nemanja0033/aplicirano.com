import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProfile: { id: string; name?: string } | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteProfileModal = ({
  open,
  onOpenChange,
  selectedProfile,
  onConfirm,
  isDeleting,
}: DeleteProfileModalProps) => {
  const t = useTranslations("ProfilePage");

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("confirm_delete_title") || "Delete profile"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("confirm_delete_desc") ||
              "Are you sure you want to delete this profile? All jobs associated with this profile will be permanently deleted."}
            <div className="mt-3 font-medium">
              {selectedProfile?.name
                ? `${t("confirm_delete_profile") || "Profile"}: ${
                    selectedProfile.name
                  }`
                : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel className="cursor-pointer bg-muted p-2 rounded-lg">
            {t("confirm_delete_cancel") || "Cancel"}
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting
              ? t("confirm_delete_deleting") || "Deleting..."
              : t("confirm_delete_confirm") || "Delete profile and jobs"}
            <Trash2 />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

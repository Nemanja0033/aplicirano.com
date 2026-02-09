import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useTranslations } from "next-intl";

interface AddResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  form: any;
  onSubmit: (data: any) => void;
}

export const AddResumeModal = ({
  open,
  onOpenChange,
  currentUser,
  form,
  onSubmit,
}: AddResumeModalProps) => {
  const t = useTranslations("ResumePage");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          className="mt-3"
          disabled={currentUser?.resumeLimit === 0}
          title={
            currentUser?.resumeLimit === 0 ? t("upload_disabled_tooltip") : undefined
          }
        >
          {t("add_resume_button")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-2 cursor-pointer right-4 text-muted-foreground"
          aria-label="Close"
        >
          ×
        </button>

        <AlertDialogHeader>
          <AlertDialogTitle>{t("upload_title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("upload_description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-4">
          <div>
            <Label className="text-sm text-primary" htmlFor="title">
              {t("form_title_label")}
            </Label>
            <Input
              id="title"
              {...register("title", {
                required: t("form_title_required"),
              })}
              placeholder={t("form_title_placeholder")}
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-primary" htmlFor="cv">
              {t("form_document_label")}
            </Label>
            <Input
              id="cv"
              type="file"
              accept=".pdf"
              className="h-12 cursor-pointer"
              {...register("cv", {
                required: t("form_document_required"),
                validate: {
                  isPdf: (files: FileList) =>
                    files &&
                    files.length > 0 &&
                    files[0].type === "application/pdf"
                      ? true
                      : t("form_document_only_pdf"),
                },
              })}
            />
            {errors.cv && (
              <p className="text-xs text-destructive mt-1">
                {errors.cv.message as string}
              </p>
            )}
          </div>

          <div className="flex w-full justify-end gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="h-12 px-4"
            >
              {t("form_cancel")}
            </Button>
            <Button
              type="submit"
              className="h-12 px-6"
              disabled={isSubmitting || currentUser?.resumeLimit === 0}
            >
              {isSubmitting ? t("form_submit_uploading") : t("form_submit")}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

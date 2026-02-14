"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

type ImportGuideModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ImportGuideModal = ({
  open,
  onOpenChange,
}: ImportGuideModalProps) => {
  const t = useTranslations("ImportGuide");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("modal_title")}</AlertDialogTitle>

          <AlertDialogDescription className="text-sm space-y-4">
            {/* TXT guide */}
            <div>
              <b>{t("txt_title")}</b>
              <div className="dark:text-gray-400 mt-2">
                1. {t("txt_step1")} <br />
                <br />
                2. {t("txt_step2")} <br />
                <br />
                <b>{t("txt_important")}</b>
              </div>
            </div>

            {/* CSV guide */}
            <div>
              <b>{t("csv_title")}</b>
              <div className="dark:text-gray-400 mt-2">
                1. {t("csv_step1")} <br />
                <br />
                2. {t("csv_step2")} <br />
                <br />
                3. {t("csv_step3")}
              </div>
            </div>

            {/* Manual entry */}
            <div>
              <b>{t("manual_title")}</b>
              <div className="dark:text-gray-400 mt-2">
                1. {t("manual_step0")} <br />
                <br />
                2. {t("manual_step1")} <br />
                <br />
                3. {t("manual_step2")}
              </div>
            </div>

            {/* Table overview */}
            <div>
              <b>{t("table_title")}</b>
              <div className="dark:text-gray-400 mt-2">
                1. {t("table_step1")} <br />
                <br />
                2. {t("table_step2")}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer bg-primary text-white dark:text-white p-2 rounded-lg shadow-md">
            {t("cancel_button")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportGuideModal;

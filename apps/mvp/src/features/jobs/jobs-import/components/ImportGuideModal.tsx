"use client";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
} from "@/src/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Info } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ImportGuideModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("ImportGuide");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="dark:text-gray-400 text-xs md:flex hidden gap-1 hover:underline cursor-pointer items-center"
      >
        <Info size={14} /> {t("button_guide")}
      </button>

      <AlertDialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("modal_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{t("txt_title")}</b> <br />
              <span className="dark:text-gray-400">
                1. {t("txt_step1")} <br /> <br />
                2. {t("txt_step2")} <br /> <br />
                <b>{t("txt_important")}</b> <br />
                <br />
              </span>
              <b>{t("manual_title")}</b>
              <br />
              <br />
              <span className="dark:text-gray-400">
                1. {t("manual_step1")} <br />
                <br />
                2. {t("manual_step2")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer bg-primary p-2 rounded-lg shadow-md">
              {t("cancel_button")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImportGuideModal;

"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/src/components/ui/alert-dialog";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AddProfileFormProps {
  name: string;
  setName: (val: string) => void;
  handleCreate: (e?: React.FormEvent) => void;
  isSubmitting: boolean;
  canCreate: boolean;
  currentUserData: any;
}

export const AddProfileForm = ({
  name,
  setName,
  handleCreate,
  isSubmitting,
  canCreate,
  currentUserData,
}: AddProfileFormProps) => {
  const t = useTranslations("ProfilePage");
  const [open, setOpen] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate(e);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={!canCreate || currentUserData?.profileLimit === 0}
      >
        {t("add_button")}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <form onSubmit={onSubmit}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("form_create")}
              </AlertDialogTitle>

              <AlertDialogDescription>
                {t("form_placeholder")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <Input
                className="w-full h-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form_placeholder")}
                disabled={!canCreate || isSubmitting}
                autoFocus
              />
            </div>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel>
                {t("cancel")}
              </AlertDialogCancel>

              <AlertDialogAction
                type="submit"
                disabled={
                  isSubmitting ||
                  currentUserData?.profileLimit === 0
                }
              >
                {isSubmitting
                  ? t("form_creating")
                  : currentUserData?.profileLimit !== 0
                    ? t("form_create")
                    : t("form_limit")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

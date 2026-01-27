"use client";

import { Bug, Languages } from "lucide-react";
import { ModeToggle } from "./theme-toggler";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import UpgradeButton from "./UpgradeButton";
import { useCurrentUser } from "../features/user/hooks/useCurrentUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthContext } from "../context/AuthProvider";

interface BugReportForm {
  bugType: string;
  bugDescription: string;
}

const Navbar = () => {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const pathname = usePathname();
  const { currentUserData } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuthContext();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<BugReportForm>({
    mode: "onSubmit",
  });

  function changeLang(locale: string) {
    router.push(pathname, { locale });
  }

  async function onSubmit(data: BugReportForm) {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await axios.post(
        "/api/bug-report",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(t("success"));
      reset();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(t("error"));
    }
  }

  return (
    <div className="flex justify-end gap-2 items-center p-3 bg-transparent">
      {!currentUserData?.isProUSer && token !== null ? <UpgradeButton /> : null}
      <ModeToggle />

      <Select onValueChange={changeLang}>
        <SelectTrigger>
          <Languages />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="sr">Srpski</SelectItem>
        </SelectContent>
      </Select>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 border bg-accent/40 rounded-lg cursor-pointer"
            >
              <Bug size={19} strokeWidth={1} />
            </button>
          </TooltipTrigger>
          <TooltipContent>{t("tooltip")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("description")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            {/* BUG TYPE */}
            <label className="text-xs">{t("bugTypeLabel")}</label>

            <Select
              {...register("bugType", { required: true 
              })}
              onValueChange={(val) =>
                setValue("bugType", val, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                {t("bugTypePlaceholder")}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jobs">{t("domains.jobs")}</SelectItem>
                <SelectItem value="ai">{t("domains.ai")}</SelectItem>
                <SelectItem value="stats">{t("domains.stats")}</SelectItem>
                <SelectItem value="profile">{t("domains.profile")}</SelectItem>
                <SelectItem value="cv">{t("domains.cv")}</SelectItem>
              </SelectContent>
            </Select>

            {errors.bugType && (
              <span className="text-xs text-red-500">
                {t("validation.type")}
              </span>
            )}

            {/* DESCRIPTION */}
            <label className="text-xs mt-2">
              {t("bugDescriptionLabel")}
            </label>

            <Textarea
              className="min-h-24"
              {...register("bugDescription", {
                required: true,
                minLength: 10,
              })}
            />

            {errors.bugDescription && (
              <span className="text-xs text-red-500">
                {t("validation.description")}
              </span>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {t("submit")}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Navbar;
"use client";

import { Bug, Languages, LogOut, Moon, Sun, User, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
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
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../features/user/hooks/useAuth";

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
  const { setTheme } = useTheme();
  const { handleSignOut, handleSignIn } = useAuth();

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
      await axios.post("/api/bug-report", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(t("success"));
      reset();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(t("error"));
    }
  }

  return (
    <div className="flex fixed z-50 right-0 top-3 justify-end gap-2 items-center p-3 bg-transparent">
      {/* {!currentUserData?.isProUSer && token !== null ? <UpgradeButton /> : null} */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-[42px] h-[41px] rounded-full flex items-center justify-center bg-primary/20 text-primary outline-none hover:bg-primary/30 transition-all cursor-pointer">
            {currentUserData?.username ? (
              currentUserData.username[0].toUpperCase()
            ) : (
              <User size={20} strokeWidth={1.5} />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit p-3">
          {currentUserData ? (
            <div className="flex gap-2 items-center border-b-1 py-3 mb-2">
              <button className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-primary/20 text-primary outline-none hover:bg-primary/30 transition-all cursor-pointer">
                {currentUserData?.username[0].toUpperCase()}
              </button>
              <div className="grid gap-1">
                <p className="text-sm">{currentUserData?.username}</p>
                <p className="text-[10px] text-muted-foreground">
                  {currentUserData?.email}
                </p>
              </div>
            </div>
          ) : null}

          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {t("theme")}
          </DropdownMenuLabel>
          <div className="flex gap-2">
            <Button
              variant={"secondary"}
              onClick={() => setTheme("light")}
              className="flex items-center gap-2"
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>{t("themes.light")}</span>
            </Button>

            <Button
              variant={"secondary"}
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>{t("themes.dark")}</span>
            </Button>
          </div>

          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {t("language")}
          </DropdownMenuLabel>
          <div className="flex gap-2">
            <Button
              variant={"secondary"}
              onClick={() => changeLang("en")}
              className="flex items-center gap-2"
            >
              🇬🇧
              <span>{t("languages.en")}</span>
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => changeLang("sr")}
              className="flex items-center gap-2"
            >
              🇷🇸
              <span>{t("languages.sr")}</span>
            </Button>
          </div>

          <DropdownMenuSeparator className="my-2" />

          {currentUserData ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
              <Bug className="h-4 w-4" strokeWidth={1.5} />
              <span>{t("tooltip")}</span>
            </button>
          ) : null}

          {currentUserData ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
              <LogOut strokeWidth={1.5} className="h-4 w-4" />
              <span>{t("logout")}</span>
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
              <LogIn strokeWidth={1.5} className="h-4 w-4" />
              <span>{t("login")}</span>
            </button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("description")}</AlertDialogDescription>
          </AlertDialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <label className="text-xs">{t("bugTypeLabel")}</label>

            <Select
              {...register("bugType", {
                required: true,
              })}
              onValueChange={(val) =>
                setValue("bugType", val, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full h-[52px]!">
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

            <label className="text-xs mt-2">{t("bugDescriptionLabel")}</label>

            <Textarea
              className="min-h-24"
              {...register("bugDescription", {
                required: true,
                minLength: 10,
              })}
              placeholder="Description"
            />

            {errors.bugDescription && (
              <span className="text-xs text-red-500">
                {t("validation.description")}
              </span>
            )}

            <div className="flex w-full justify-center gap-[8px] mt-4">
              <Button
                className="w-1/2"
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                className="w-1/2"
                type="submit"
                disabled={isSubmitting || !isDirty}
              >
                {t("submit")}
              </Button>
            </div>
          </form>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-muted-foreground cursor-pointer">X</button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Navbar;

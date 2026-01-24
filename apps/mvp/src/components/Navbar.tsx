"use client";
import { SparklesIcon } from "lucide-react";
import { ModeToggle } from "./theme-toggler";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import UpgradeButton from "./UpgradeButton";
import { useCurrentUser } from "../features/user/hooks/useCurrentUser";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUserData } = useCurrentUser();

  function changeLang(locale: string) {
    router.push(pathname, { locale });
  }

  return (
    <div className="flex justify-end gap-2 items-center p-3 bg-transparent">
      {!currentUserData?.isProUSer ? <UpgradeButton /> : null}
      <ModeToggle />

      <Select onValueChange={changeLang}>
        <SelectTrigger className="w-fit">
          <span>Lang</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="sr">Srpski</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Navbar;
"use client";
import { SparklesIcon } from "lucide-react";
import { ModeToggle } from "./theme-toggler";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import { useRouter, usePathname } from "@/src/i18n/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  function changeLang(locale: string) {
    router.push(pathname, { locale });
  }

  return (
    <div className="flex justify-end gap-2 items-center p-3 bg-transparent">
      <Button size={"lg"}>
        Nadogradi na{" "}
        <span className="flex items-center gap-1 text-cyan-300 animate-pulse">
          <SparklesIcon /> Pro
        </span>
      </Button>
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
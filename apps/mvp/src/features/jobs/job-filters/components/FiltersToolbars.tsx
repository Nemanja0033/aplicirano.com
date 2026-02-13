import { Input } from "@/src/components/ui/input";
import { Filters } from "../types";
import { Search, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/src/components/ui/select";

export default function FiltersToolbar({ filterType,searchTerm, isDisabled, handleSearch, changeStatus}: Filters){
  const t = useTranslations("JobsTable");

  return (
      <div className="md:flex grid md:W-[454px] items-center gap-2">
        <div className="relative md:w-full w-64">
          <Search aria-label="search icon" className="absolute text-gray-400 w-[16px] h-[16px] top-[30%] left-4" />
          <Input aria-label="search applied jobs" disabled={isDisabled} value={searchTerm} onChange={handleSearch} className="w-full h-11! rounded-lg border px-10" placeholder={t("search_label")} />
        </div>
          {filterType === 'JOBS' && (
            <Select onValueChange={(value) => changeStatus(value)}>
              <SelectTrigger className="flex items-center gap-2 h-[44px]! rounded-[8px]!"><Settings2 /> {t("all_status")}</SelectTrigger>
              <SelectContent onChange={(e) => changeStatus((e.target as HTMLSelectElement).value)}>
                <SelectItem value=" ">{t("all_status")}</SelectItem>
                <SelectItem value={"APPLIED"}>{t("status_applied")}</SelectItem>
                <SelectItem value={"REJECTED"}>{t("status_rejected")}</SelectItem>
                <SelectItem value={"INTERVIEW"}>{t("status_interview")}</SelectItem>
                <SelectItem value={"OFFER"}>{t("status_offer")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
    )
  }
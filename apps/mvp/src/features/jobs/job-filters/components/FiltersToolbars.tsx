import { Input } from "@/src/components/ui/input";
import { Filters } from "../types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FiltersToolbar({ filterType,searchTerm, isDisabled, handleSearch, changeStatus}: Filters){
  const t = useTranslations("JobsTable");

  return (
      <div className="flex w-full items-center gap-2">
        <div className="relative md:w-full w-64">
          <Search aria-label="search icon" className="absolute text-gray-400 top-1.5 left-2" />
          <Input aria-label="search applied jobs" disabled={isDisabled} value={searchTerm} onChange={handleSearch} className="w-full h-10 border px-10" placeholder={t("search_label")} />
        </div>
          {filterType === 'JOBS' && (
            <select aria-label="filter the jobs" defaultValue={""} onChange={(e) => changeStatus(e.target.value)} className={`cursor-pointer h-10 w-28 p-1 border rounded-md bg-accent/40`}>
                <option className="bg-background" value="">{t("all_status")}</option>
                <option className="bg-background" value={"APPLIED"}>{t("status_applied")}</option>
                <option className="bg-background" value={"REJECTED"}>{t("status_rejected")}</option>
                <option className="bg-background" value={"INTERVIEW"}>{t("status_interview")}</option>
                <option className="bg-background" value={"OFFER"}>{t("status_offer")}</option>
            </select>
          )}
        </div>
    )
  }
import { Input } from "@/components/ui/input";
import { Filters } from "../types";
import { Search } from "lucide-react";

export default function FiltersToolbar({ filterType,searchTerm, isDisabled, handleSearch, changeStatus}: Filters){
  return (
      <div className="flex w-full items-center gap-2">
        <div className="relative md:w-full w-64">
          <Search aria-label="search icon" className="absolute text-gray-400 top-1.5 left-2" />
          <Input aria-label="search applied jobs" disabled={isDisabled} value={searchTerm} onChange={handleSearch} className="w-full h-10 border px-10" placeholder="Search companies..." />
        </div>
          {filterType === 'JOBS' && (
            <select aria-label="filter the jobs" defaultValue={""} onChange={(e) => changeStatus(e.target.value)} className={`cursor-pointer h-10 w-28 p-1 border rounded-md bg-accent/40`}>
                <option className="bg-background" value="">All Status</option>
                <option className="bg-background" value={"APPLIED"}>Applied</option>
                <option className="bg-background" value={"REJECTED"}>Rejected</option>
                <option className="bg-background" value={"INTERVIEW"}>Interview</option>
                <option className="bg-background" value={"OFFER"}>Offer</option>
            </select>
          )}
        </div>
    )
  }
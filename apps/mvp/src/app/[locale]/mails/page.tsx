"use client"
import Loader from "@/components/Loader";
import FiltersToolbar from "@/src/features/jobs/job-filters/components/FiltersToolbars";
import { useFilters } from "@/src/features/jobs/job-filters/hooks/useFilters";
import EmailCard from "@/src/features/mails/components/EmailCard";
import { Email, useFetchMails } from "@/src/features/mails/hooks/useFetchMails";

export default function MailsPags() {
  const { mails, isLoading } = useFetchMails();
  const { filteredData: mailsToDislplay, query, status, setQuery } = useFilters(mails, "EMAIL");

  if(isLoading){
    return <Loader type="NORMAL" />
  }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="w-5xl p-3 grid place-items-center gap-3 mt-14">
        {mailsToDislplay.length > 0 && !isLoading && <FiltersToolbar filterType="EMAILS" isDisabled={false} searchTerm={query} status={status} handleSearch={(e) => setQuery(e.target.value)} showApplied={() => {}} showInterview={() => {}} showRejected={() => {}} reset={() => {}}  />      }
        {mailsToDislplay.length > 0 && !isLoading ? mailsToDislplay?.map((mail: Email) => (
            <EmailCard mail={mail} key={mail.id} />
        )) : <span className="text-gray-400 mt-20">Cannot fetch emails right now :/</span>}
      </div>
    </main>
  );
}

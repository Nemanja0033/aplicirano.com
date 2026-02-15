import { useTranslations } from "next-intl";
import { Resume } from "../types";
import { ResumeItem } from "./ResumeItem";

interface ResumeListProps {
  resumes: Resume[] | undefined;
  onDelete: (resume: { id: string; title?: string }) => void;
}

export const ResumeList = ({ resumes, onDelete }: ResumeListProps) => {
  const t = useTranslations("ResumePage");

  return (
    <div className="mt-6 grid grid-cols-4 w-full md:gap-15 gap-3">
      {resumes?.length === 0 && (
        <div className="text-sm w-full flex justify-center text-muted-foreground text-center py-6 rounded-lg">
          {t("no_resumes")}
        </div>
      )}

      {resumes?.map((r) => (
        <ResumeItem key={r.id} resume={r} onDelete={onDelete} />
      ))}
    </div>
  );
};

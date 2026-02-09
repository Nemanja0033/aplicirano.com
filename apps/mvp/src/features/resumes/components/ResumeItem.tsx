import { Trash2 } from "lucide-react";
import { formatFileSize } from "@/helpers";
import { useTranslations } from "next-intl";
import { Resume } from "../types";

interface ResumeItemProps {
  resume: Resume;
  onDelete: (resume: { id: string; title?: string }) => void;
}

export const ResumeItem = ({ resume, onDelete }: ResumeItemProps) => {
  const t = useTranslations("ResumePage");

  return (
    <div className="flex hover:opacity-80 transition-all items-center justify-between p-3 border rounded-lg bg-background">
      <div className="grid gap-1">
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {resume.title || t("resume_default_title")}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("resume_file_label", {
            size: formatFileSize(Number(resume.fileSize)),
          })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={resume.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {t("resume_view")}
        </a>

        <button
          onClick={() => onDelete({ id: resume.id, title: resume.title })}
          className="text-red-700 cursor-pointer"
          aria-label={`Delete resume ${resume.title}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

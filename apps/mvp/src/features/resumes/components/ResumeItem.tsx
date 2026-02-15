"use client";

import { Trash2, Eye, EllipsisVertical } from "lucide-react";
import { formatFileSize } from "@/helpers";
import { useTranslations } from "next-intl";
import { Resume } from "../types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";

interface ResumeItemProps {
  resume: Resume;
  onDelete: (resume: { id: string; title?: string }) => void;
}

export const ResumeItem = ({ resume, onDelete }: ResumeItemProps) => {
  const t = useTranslations("ResumePage");

  return (
    <div className="flex md:w-[356px] w-[300px] p-6 hover:opacity-80 transition-all items-center justify-between border rounded-lg">
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

      {/* Dropdown za akcije */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
          <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={resume.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Eye size={16} />
              {t("resume_view")}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete({ id: resume.id, title: resume.title })}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Trash2 size={16} />
            {t("resume_delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
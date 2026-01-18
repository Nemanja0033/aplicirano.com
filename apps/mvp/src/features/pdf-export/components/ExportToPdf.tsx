"use client";
import { Button } from "@/src/components/ui/button";
import { Download } from "lucide-react";
import { sanitizeLabColors } from "@/helpers";
import { useState } from "react";
import Loader from "@/src/components/Loader";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

const ExportToPdf = ({ elementRef, isDisabled }: { elementRef: any; isDisabled: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("FileExport");
  const { currentUserData } = useCurrentUser();

  const handleDownloadPdf = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 0));
    sanitizeLabColors(document.body);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({ filename: "Applied_Job_List.pdf" })
        .from(elementRef)
        .save();
    } catch (err) {
      console.error("PDF export failed", err);
    }

    location.reload();
  };

  if (isLoading) {
    return <Loader type="WAITING_FOR_PDF" />;
  }

  const disabled = isDisabled || !currentUserData?.isProUser;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* wrap u span jer disabled button ne emituje events */}
          <span>
            <Button disabled={disabled} onClick={handleDownloadPdf}>
              <Download />
              {t("export_btn")}
            </Button>
          </span>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent className="bg-background text-black dark:text-white">
            <p>{t("disabled_tooltip")}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExportToPdf;

import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

interface ChatActionsProps {
  isLoading: boolean;
  currentUserData: any;
  onOpenCvModal: () => void;
  onSendPrompt: (prompt: string) => void;
}

export const ChatActions = ({
  isLoading,
  currentUserData,
  onOpenCvModal,
  onSendPrompt,
}: ChatActionsProps) => {
  const t = useTranslations("ChatbotPage");

  return (
    <div className="w-full justify-start px-5 bg-white dark:bg-background p-3 items-center rounded-lg md:flex grid grid-cols-1 gap-3 relative">
      <Button
        disabled={
          isLoading ||
          !currentUserData?.isProUSer ||
          currentUserData?.apiCredits === 0
        }
        onClick={onOpenCvModal}
        variant={"secondary"}
      >
        {" "}
        {/* {!currentUserData?.isProUSer && (
          <span className="text-xs absolute text-purple-500 top-0 left-0">
            {" "}
            {t("pro_label")}{" "}
          </span>
        )}{" "} */}
        {t("evaluate_cv")}{" "}
      </Button>{" "}
      <Button
        disabled={isLoading || currentUserData?.apiCredits === 0}
        onClick={() => onSendPrompt(t("quick_stats_prompt"))}
        variant={"secondary"}
      >
        {" "}
        {t("quick_stats")}{" "}
      </Button>{" "}
      <Button
        disabled={isLoading || currentUserData?.apiCredits === 0}
        onClick={() => onSendPrompt(t("interviews_prompt"))}
        variant={"secondary"}
      >
        {" "}
        {t("interviews")}{" "}
      </Button>{" "}
      <Button
        disabled={isLoading || currentUserData?.apiCredits === 0}
        onClick={() => onSendPrompt(t("progress_prompt"))}
        variant={"secondary"}
      >
        {" "}
        {t("progress")}{" "}
      </Button>
    </div>
  );
};

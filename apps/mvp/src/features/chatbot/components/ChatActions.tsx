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
    <div className="w-full justify-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar p-3 items-center rounded-lg flex gap-3 relative">
      <Button
        disabled={
          isLoading ||
          !currentUserData?.isProUSer ||
          currentUserData?.apiCredits === 0
        }
        onClick={onOpenCvModal}
        className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary relative hover:text-white"
        variant={"outline"}
      >
        {" "}
        {!currentUserData?.isProUSer && (
          <span className="text-xs absolute text-purple-500 top-0 left-0">
            {" "}
            {t("pro_label")}{" "}
          </span>
        )}{" "}
        {t("evaluate_cv")}{" "}
      </Button>{" "}
      <Button
        disabled={isLoading || currentUserData?.apiCredits === 0}
        onClick={() => onSendPrompt(t("quick_stats_prompt"))}
        className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary hover:text-white"
        variant={"outline"}
      >
        {" "}
        {t("quick_stats")}{" "}
      </Button>{" "}
      <Button
        disabled={isLoading || currentUserData?.apiCredits === 0}
        onClick={() => onSendPrompt(t("interviews_prompt"))}
        className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary hover:text-white"
        variant={"outline"}
      >
        {" "}
        {t("interviews")}{" "}
      </Button>{" "}
      <Button
        disabled={isLoading || currentUserData?.apiCredits === 0}
        onClick={() => onSendPrompt(t("progress_prompt"))}
        className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary hover:text-white"
        variant={"outline"}
      >
        {" "}
        {t("progress")}{" "}
      </Button>
    </div>
  );
};

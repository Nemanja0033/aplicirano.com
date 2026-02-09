import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChatInputProps {
  token: string | null;
  apiCredits: number;
  prompt: string;
  setPrompt: (value: string) => void;
  isLoading: boolean;
  onSend: () => void;
}

export const ChatInput = ({
  token,
  apiCredits,
  prompt,
  setPrompt,
  isLoading,
  onSend,
}: ChatInputProps) => {
  const t = useTranslations("ChatbotPage");

  return (
    <div className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar p-3 items-center rounded-lg flex gap-3 relative">
      <Textarea
        disabled={!token || apiCredits === 0}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="max-h-20 rounded-xl bg-accent/40 max-w-[1010px] pr-32"
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
      />
      <Button
        aria-label={t("send_button")}
        name="send-message-button"
        className="absolute right-3 h-16 w-20 top-3"
        onClick={onSend}
        size="lg"
        disabled={isLoading || !token || apiCredits === 0}
      >
        <Send />
      </Button>
    </div>
  );
};

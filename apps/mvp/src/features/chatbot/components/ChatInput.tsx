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
    <div className="w-full bg-white dark:bg-background p-3 rounded-lg flex items-end gap-3">
      <Textarea
        disabled={!token || apiCredits === 0}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        className="flex-1 min-w-0 max-h-20 rounded-xl bg-accent/40 resize-none"
      />

      <Button
        aria-label={t("send_button")}
        name="send-message-button"
        onClick={onSend}
        size="lg"
        disabled={isLoading || !token || apiCredits === 0}
        className="h-16 w-20 shrink-0"
      >
        <Send />
      </Button>
    </div>
  );
};

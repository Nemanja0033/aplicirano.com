import { Message } from "../types";
import { ChatMessage } from "./ChatMessage";
import { useTranslations } from "next-intl";

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  userPhoto?: string;
}

export const ChatList = ({ messages, isLoading, userPhoto }: ChatListProps) => {
  const t = useTranslations("ChatbotPage");

  return (
    <div className="w-full p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar overflow-auto rounded-xl border h-[80vh]">
      <div className="flex flex-col gap-6">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} userPhoto={userPhoto} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <span className="animate-pulse dark:bg-gray-800/40 bg-gray-200 rounded-md p-3">
              {t("thinking")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

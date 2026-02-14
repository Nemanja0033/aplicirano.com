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
    <div className="w-full p-3 bg-white dark:bg-background overflow-auto md:h-[67vh] h-screen border-b">
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

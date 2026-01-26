"use client";
import Loader from "@/src/components/Loader";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { fetchCurrentUserData } from "@/src/features/user/service/user-service";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Send, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type Role = "user" | "ai";
interface Message {
  role: Role;
  content: string;
}

// *TODO* Refactor

export default function ChatbotPage() {
  const t = useTranslations("ChatbotPage");
  const queryClient = useQueryClient();
  const { user, token } = useFirebaseUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: t("welcome_message") },
  ]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const { data: currentUserData, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentUserData(token as any),
    enabled: !!token,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("chatMessages");
    if (stored && token) {
      try {
        const parsed: Message[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (err) {
        console.error("Failed to parse messages from sessionStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        sendPrompt(prompt);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (currentUserData?.apiCredits === 0) {
      toast.warning(t("tokens_limit_warning"));
    }
  }, [currentUserData, t]);

  async function sendPrompt(input: string) {
    if (!input.trim()) return;
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const res = await axios.post(
        "/api/chatbot",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const msg = res?.data.message ?? t("error_no_response");

      setMessages((prev) => [...prev, { role: "ai", content: msg }]);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: t("error_generic") },
      ]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  }

// useEffect(() => {
//   if (!token) {
//     location.href = "auth";
//   }
// }, []);

  if (isUserLoading) {
    return <Loader type="NORMAL" />;
  }

  // if(isMobile){
  //   return(
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <h1 className="text-gray-400 text-2xl font-semibold">{t("desktop_only_message")}</h1>
  //     </div>
  //   )
  // }

  return (
    <main className="w-full h-screen flex justify-center items-start">
      <div className="md:w-6xl w-full p-3 grid place-items-center gap-5">
        <div className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <div className="w-full p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar overflow-auto rounded-xl border h-[80vh]">
          <div className="flex flex-col gap-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "ai" ? "flex justify-start" : "flex justify-end"
                }
              >
                <div
                  className={
                    "rounded-xl p-5 max-w-[70%] flex items-start gap-2 " +
                    (m.role === "ai"
                      ? "dark:bg-gray-800/40 bg-gray-200"
                      : "dark:bg-blue-900/40 bg-blue-200")
                  }
                >
                  {m.role === "user" ? (
                    <img
                      src={user?.photoURL as string}
                      className="rounded-full w-8 h-8"
                      alt="user avatar"
                    />
                  ) : (
                    <Sparkle />
                  )}
                  <span>{m.content}</span>
                </div>
              </div>
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

        <div className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar p-3 items-center rounded-lg flex gap-3 relative">
          <Textarea
            disabled={!token || currentUserData.apiCredits === 0}
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
            onClick={() => sendPrompt(prompt)}
            size="lg"
            disabled={isLoading || !token || currentUserData.apiCredits === 0}
          >
            <Send />
          </Button>
        </div>
      </div>
    </main>
  );
}

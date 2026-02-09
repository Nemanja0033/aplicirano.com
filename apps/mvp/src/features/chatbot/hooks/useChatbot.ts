import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";
import { Message, Role } from "../types";

export function useChatbot() {
  const locale = useLocale();
  const t = useTranslations("ChatbotPage");
  const queryClient = useQueryClient();
  const { user, token } = useFirebaseUser();
  const { currentUserData, isUserLoading } = useCurrentUser();

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: t("welcome_message") },
  ]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCvSelectModalOpen, setIsCvSelectModalOpen] = useState(false);

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
  }, [token]);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        // Only trigger send on Enter if not shift+enter (optional common behavior) or just Enter
        // But original code was just Enter.
      if (e.key === "Enter") {
        sendPrompt(prompt);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [prompt, messages, token]); // Dependencies from original code

  useEffect(() => {
    if (currentUserData?.apiCredits === 0) {
      toast.warning(t("tokens_limit_warning"));
    }
  }, [currentUserData, t]);

  async function sendPrompt(
    input: string,
    options?: { resumeContent?: string }
  ) {
    const trimmed = (input ?? "").trim();
    const hasResume = !!options?.resumeContent;

    if (!trimmed && !hasResume) return;

    setIsLoading(true);

    const userMessageContent = hasResume
      ? t("resume_attached") || "Poslao/la si CV"
      : trimmed;

    const newUserMessage: Message = {
      role: "user",
      content: userMessageContent,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const body: any = {
        prompt: trimmed,
      };

      if (hasResume && currentUserData?.isProUSer === true) {
        body.resumeContent = options!.resumeContent;
      }

      const res = await axios.post("/api/chatbot", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-locale": locale,
        },
      });

      const msg = res?.data?.message ?? t("error_no_response");

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

  return {
    messages,
    prompt,
    setPrompt,
    isLoading,
    isCvSelectModalOpen,
    setIsCvSelectModalOpen,
    sendPrompt,
    currentUserData,
    isUserLoading,
    token,
    user,
    t,
  };
}

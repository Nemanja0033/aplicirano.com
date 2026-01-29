"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/src/components/Loader";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Paperclip, Send, Sparkle, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { NotAuthScreen } from "@/src/components/NotAuthScreen";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
} from "@/src/components/ui/alert-dialog";
import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";
import { formatDate } from "date-fns";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type Role = "user" | "ai";
interface Message {
  role: Role;
  content: string;
}

// Helper to detect likely markdown content
function isLikelyMarkdown(text: string) {
  if (!text) return false;
  const mdIndicators = [
    "###",
    "## ",
    "---",
    "**",
    "- ",
    "* ",
    "`",
    "> ",
    "```",
  ];
  return mdIndicators.some((ind) => text.includes(ind));
}

export default function ChatbotPage() {
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
  const isMobile = useIsMobile();
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
      if (e.key === "Enter") {
        // Keep original behavior: send on Enter
        sendPrompt(prompt);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [prompt, messages, token]);

  useEffect(() => {
    if (currentUserData?.apiCredits === 0) {
      toast.warning(t("tokens_limit_warning"));
    }
  }, [currentUserData, t]);

  /**
   * sendPrompt
   * - input: optional textual prompt
   * - options.resumeContent: optional resume text to be sent to the backend
   *
   * Behavior:
   * - If resumeContent is provided, do NOT inject the full resume text into messages state.
   *   Instead add a small placeholder user message (e.g. "CV poslat") so chat shows an action,
   *   and send resumeContent in the request body as separate field.
   * - If resumeContent is not provided, behave as before (optimistic user message + send full chat).
   */
  async function sendPrompt(
    input: string,
    options?: { resumeContent?: string }
  ) {
    const trimmed = (input ?? "").trim();
    const hasResume = !!options?.resumeContent;

    // If no input and no resume, nothing to send
    if (!trimmed && !hasResume) return;

    setIsLoading(true);

    // Prepare optimistic user message.
    // If sending resume, do NOT put resume content into state; use a placeholder.
    const userMessageContent = hasResume
      ? t("resume_attached") || "Poslao/la si CV"
      : trimmed;

    const newUserMessage: Message = {
      role: "user",
      content: userMessageContent,
    };

    // Optimistically add user message (placeholder if resume)
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const body: any = {
        prompt: trimmed,
      };

      // If resumeContent provided, attach it as separate field (route supports both scenarios)
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

      // Append AI response
      setMessages((prev) => [...prev, { role: "ai", content: msg }]);

      // Refresh user data (credits etc.)
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

  if (isUserLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return <NotAuthScreen />;
  }

  return (
    <main className="w-full h-screen flex justify-center items-start">
      <div className="md:w-6xl w-full p-3 grid place-items-center gap-5">
        <div className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <div className="w-full p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar overflow-auto rounded-xl border h-[80vh]">
          <div className="flex flex-col gap-6">
            {messages.map((m, i) => {
              const isAi = m.role === "ai";
              const shouldRenderMarkdown = isAi && isLikelyMarkdown(m.content);

              return (
                <div
                  key={i}
                  className={isAi ? "flex justify-start" : "flex justify-end"}
                >
                  <div
                    className={
                      "rounded-xl p-5 max-w-[70%] flex items-start gap-2 " +
                      (isAi
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

                    <div className="prose max-w-none dark:prose-invert break-words">
                      {shouldRenderMarkdown ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                          components={{
                            h1: ({ node, ...props }) => (
                              <h3
                                className="text-lg font-semibold"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h4
                                className="text-md font-semibold"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h5
                                className="text-sm font-semibold"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                className="text-sm leading-relaxed"
                                {...props}
                              />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                className="text-primary underline"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="ml-4 list-disc" {...props} />
                            ),
                            code: ({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) =>
                              inline ? (
                                <code
                                  className="bg-muted px-1 rounded text-xs"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <pre
                                  className="bg-muted p-2 rounded text-xs overflow-auto"
                                  {...(props as React.HTMLAttributes<HTMLPreElement>)}
                                >
                                  <code>{children}</code>
                                </pre>
                              ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <span className="text-sm">{m.content}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <span className="animate-pulse dark:bg-gray-800/40 bg-gray-200 rounded-md p-3">
                  {t("thinking")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full justify-center dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar p-3 items-center rounded-lg flex gap-3 relative">
          <Button
            disabled={isLoading || !currentUserData?.isProUSer || currentUserData?.apiCredits === 0}
            onClick={() => setIsCvSelectModalOpen(true)}
            className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary relative hover:text-white"
            variant={"outline"}
          >
            {!currentUserData?.isProUSer && <span className="text-xs absolute text-purple-500 top-0 left-0">Pro</span>}
            Oceni mi CV
          </Button>
          <Button
            disabled={isLoading || currentUserData?.apiCredits === 0}
            onClick={() =>
              sendPrompt(
                "Mozes li mi poslati statistiku svih mojih prijava? Brojeve prijava, statusa i ostalog..."
              )
            }
            className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary hover:text-white"
            variant={"outline"}
          >
            Brza statistika
          </Button>
          <Button
            disabled={isLoading || currentUserData?.apiCredits === 0}
            onClick={() => sendPrompt("Imam li zakazane intervjue?")}
            className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary hover:text-white"
            variant={"outline"}
          >
            Imam li zakazane intervjue?
          </Button>
          <Button
            disabled={isLoading || currentUserData?.apiCredits === 0}
            onClick={() => sendPrompt("Kako napredujem kroz vreme?")}
            className="border-none rounded-full p-4 text-muted-foreground hover:bg-primary hover:text-white"
            variant={"outline"}
          >
            Kako napredujem kroz vreme?
          </Button>
        </div>

        <div className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] bg-white dark:bg-sidebar p-3 items-center rounded-lg flex gap-3 relative">
          <Textarea
            disabled={!token || currentUserData?.apiCredits === 0}
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
            disabled={isLoading || !token || currentUserData?.apiCredits === 0}
          >
            <Send />
          </Button>
        </div>
      </div>

      <AlertDialog
        open={isCvSelectModalOpen}
        onOpenChange={setIsCvSelectModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Izaberi CV</AlertDialogTitle>
            <AlertDialogDescription>
              Odaberi CV za koji zelis da bude skeniran od strane AI asistenta
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3 place-items-center w-full">
            {currentUserData?.resumes.map((cv) => (
              <div
                onClick={() =>
                  // send only resume content to the backend, do NOT inject full resume into messages state
                  sendPrompt("", { resumeContent: cv.resumeContent as string })
                }
                key={cv.id}
                className="border-2 shadow-md cursor-pointer hover:opacity-80 flex gap-3 items-center p-3 rounded-md w-full"
              >
                <Paperclip size={18} strokeWidth={1} />
                <span>{cv.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(new Date(cv.createdAt), "yyyy-MM-dd")}
                </span>
              </div>
            ))}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

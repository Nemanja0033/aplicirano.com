"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import axios from "axios";
import { Send, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";

type Role = "user" | "ai";
interface Message {
  role: Role;
  content: string;
}

const aiWelcomeMessage =
  "Hello I'm TrakifyAI! I can help you with your job application process. Do you want me to check you recent job applications or anything else?";

export default function ChatbotPage() {
  const { user, token } = useFirebaseUser();
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", content: aiWelcomeMessage },]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

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
      if (e.key === 'Enter') {
        sendPrompt(prompt);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  async function sendPrompt(input: string) {
    if (!input.trim()) return;
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const res = await axios.post(
            "http://localhost:3000/chatbot",
            { message: input },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );
        const msg = res?.data ?? "Sorry, no response.";

        setMessages((prev) => [...prev, { role: "ai", content: msg }]);
    } catch (err) {
        console.error(err);
        setMessages((prev) => [
            ...prev,
            { role: "ai", content: "Something went wrong. Try again." },
        ]);
    } finally {
        setIsLoading(false);
        setPrompt("");
    }
  }
    
  // if(isMobile){
  //   return(
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <h1 className="text-gray-400 text-2xl font-semibold">Please use desktop version for best experience</h1>
  //     </div>
  //   )
  // }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="md:w-6xl w-full p-3 grid place-items-center gap-2">
        <div className="w-full grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground text-sm">Get AI-powered help with your job applications</p>
        </div>

        <div className="w-full p-5 bg-white dark:bg-sidebar overflow-auto rounded-xl border h-[80vh]">
          <div className="flex flex-col gap-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "ai" ? "flex justify-start" : "flex justify-end"}
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
                  ) : <Sparkle />}
                  <span>{m.content}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <span className="animate-pulse dark:bg-gray-800/40 bg-gray-200 rounded-md p-3">
                  Thinking...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full bg-white dark:bg-sidebar p-3 items-center rounded-lg flex gap-3 relative">
          <Textarea
            disabled={!token}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="max-h-20 rounded-xl bg-accent/40 max-w-[1010px] pr-32"
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <Button aria-label="send the message" name="send-message-button" className="absolute right-3 h-16 w-20 top-3" onClick={() => sendPrompt(prompt)} size="lg" disabled={isLoading || !token}>
            <Send />
          </Button>
        </div>
      </div>
    </main>
  );
}
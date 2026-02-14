"use client";
import React from "react";
import Loader from "@/src/components/Loader";
import { NotAuthScreen } from "@/src/components/NotAuthScreen";
import { useChatbot } from "@/src/features/chatbot/hooks/useChatbot";
import { ChatHeader } from "@/src/features/chatbot/components/ChatHeader";
import { ChatList } from "@/src/features/chatbot/components/ChatList";
import { ChatActions } from "@/src/features/chatbot/components/ChatActions";
import { ChatInput } from "@/src/features/chatbot/components/ChatInput";
import { CvSelectionModal } from "@/src/features/chatbot/components/CvSelectionModal";

export default function ChatbotPage() {
  const {
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
  } = useChatbot();

  if (isUserLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return <NotAuthScreen />;
  }

  return (
    <main className="w-full h-screen flex justify-center items-start">
      <div className="w-full p-3 grid place-items-center ">
        <ChatHeader />

        <ChatList
          messages={messages}
          isLoading={isLoading}
          userPhoto={user?.photoURL as string}
        />

        <ChatActions
          isLoading={isLoading}
          currentUserData={currentUserData}
          onOpenCvModal={() => setIsCvSelectModalOpen(true)}
          onSendPrompt={sendPrompt}
        />

        <ChatInput
          token={token}
          apiCredits={currentUserData?.apiCredits as number}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          onSend={() => sendPrompt(prompt)}
        />
      </div>

      <CvSelectionModal
        open={isCvSelectModalOpen}
        onOpenChange={setIsCvSelectModalOpen}
        resumes={currentUserData?.resumes as any}
        onSelectResume={(content) =>
          sendPrompt("", { resumeContent: content })
        }
      />
    </main>
  );
}

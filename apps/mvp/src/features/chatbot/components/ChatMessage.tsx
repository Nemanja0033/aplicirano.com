import { Message } from "../types";
import { isLikelyMarkdown } from "../utils/markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Sparkle } from "lucide-react";
import React from "react";

interface ChatMessageProps {
  message: Message;
  userPhoto?: string;
}

export const ChatMessage = ({ message, userPhoto }: ChatMessageProps) => {
  const isAi = message.role === "ai";
  const shouldRenderMarkdown = isAi && isLikelyMarkdown(message.content);

  return (
    <div className={isAi ? "flex justify-start" : "flex justify-end"}>
      <div
        className={
          "rounded-xl p-5 max-w-[70%] flex items-start gap-2 " +
          (isAi
            ? "dark:bg-gray-800/40 bg-gray-200"
            : "dark:bg-blue-900/40 bg-blue-200")
        }
      >
        {message.role === "user" ? (
          <img
            src={userPhoto}
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
                  <h3 className="text-lg font-semibold" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h4 className="text-md font-semibold" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h5 className="text-sm font-semibold" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-sm leading-relaxed" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-primary underline" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4 list-disc" {...props} />
                ),
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !className; // improved logic or just used props if available, but simplest fix for type:
                  // The issue is 'inline' prop. We can extract it if we cast or ignore details, 
                  // but react-markdown passes 'inline' boolean.
                  // Let's explicitly look for it in props as any to avoid TS error
                  const { inline } = props as any;
                  
                  return inline ? (
                    <code className="bg-muted px-1 rounded text-xs" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre
                      className="bg-muted p-2 rounded text-xs overflow-auto"
                      {...(props as React.HTMLAttributes<HTMLPreElement>)}
                    >
                      <code>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <span className="text-sm">{message.content}</span>
          )}
        </div>
      </div>
    </div>
  );
};

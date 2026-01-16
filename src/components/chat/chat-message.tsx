'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { CodeBlock } from "./code-block";
import ChatTable from "./ChatTable";

interface ChatMessageProps {
  message: {
    role: "user" | "bot";
    content: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isObjectData = Array.isArray(message.content);

  // const parts = message.content.split(/(```[\s\S]*?```)/g).filter(Boolean);

  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-card border">
          <AvatarFallback className="bg-transparent">
            <Bot className="h-5 w-5 text-accent" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-xl p-3 px-4 max-w-xs md:max-w-md lg:max-w-2xl shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        )}
      >
        <div className="text-sm space-y-2">
            {isObjectData ? <ChatTable data={Array.isArray(message.content) ? message.content : []} /> :
            
            message.content.split(/(```[\s\S]*?```)/g).filter(Boolean).map((part, index) => {
              const codeMatch = part.match(/```(\w*)\n([\s\S]*?)```/);
              if (codeMatch) {
                const language = codeMatch[1];
                const code = codeMatch[2].trim();
                return <CodeBlock key={index} code={code} language={language} />;
              }
              return <p key={index} className="whitespace-pre-wrap leading-relaxed">{part}</p>;
            })}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

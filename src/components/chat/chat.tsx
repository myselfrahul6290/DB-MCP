"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getAiResponse } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bot } from "lucide-react";

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatInput = z.infer<typeof chatSchema>;

const LoadingDots = () => (
    <div className="flex items-center space-x-1 text-foreground">
        <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
    </div>
);

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatInput>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const onSubmit = async (data: ChatInput) => {
    const userMessage: Message = { role: "user", content: data.message };
    const newHistory = [...messages, userMessage];
    
    setMessages(newHistory);
    setIsLoading(true);
    form.reset();

    try {
      const botResponseContent = await getAiResponse(newHistory);
      const botMessage: Message = { role: 'bot', content: botResponseContent };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        role: "bot",
        content: "Sorry, I had trouble processing that. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        form.handleSubmit(onSubmit)();
      }
    }
  };


  return (
    <div className="flex flex-col h-[calc(100dvh)] w-full max-w-4xl mx-auto bg-background">
      <header className="p-4 border-b w-full">
        <h1 className="text-2xl font-bold text-center text-foreground font-headline">BeatLedger</h1>
      </header>

      <div ref={messageListRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <div className="p-4 bg-card rounded-full mb-4 shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent"
                    >
                        <path d="M12 6V2L4 8l8 6v-4c5.5 0 10 4.5 10 10 0-7.1-3.3-13.3-8.8-15.6" />
                        <path d="M4 14c0 4.4 3.6 8 8 8" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-foreground">How can I help you today?</h2>
            </div>
        ) : (
            messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))
        )}
        {isLoading && (
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-card border">
                    <AvatarFallback className="bg-transparent">
                        <Bot className="h-5 w-5 text-accent" />
                    </AvatarFallback>
                </Avatar>
                <div className="rounded-xl p-3 px-4 max-w-xs bg-card text-card-foreground shadow-sm flex items-center">
                    <LoadingDots />
                </div>
            </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-background">
        <div className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Message BeatLedger..."
                        className="pr-16 py-3 min-h-[52px] resize-none"
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                size="icon"
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-accent hover:bg-accent/90",
                )}
                disabled={isLoading || !form.watch("message")}
                aria-label="Send message"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

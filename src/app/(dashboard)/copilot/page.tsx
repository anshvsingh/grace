"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm Grace AI 👋 I'm your startup and SaaS advisor. Ask me anything about your business strategy, pricing, MVP planning, or growth!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<string[]>([
    "Give me a strategy to start a venture",
    "How to price my SaaS",
    "Best way to find first customers",
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Sorry, something went wrong!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I ran into an error. Please try again!",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleNewChat = () => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      if (firstUserMsg) {
        setChats((prev) => [firstUserMsg.content.slice(0, 30) + "...", ...prev]);
      }
    }
    setMessages([
      {
        role: "assistant",
        content: "Hey! I'm Grace AI 👋 Starting a new chat. What's on your mind?",
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">

      {/* Chat History Sidebar */}
      <div className="w-56 rounded-xl p-4 flex flex-col gap-2"
        style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "hsl(215 20% 65%)" }}>
            Chat History
          </p>
          <button
            onClick={handleNewChat}
            className="text-xs"
            style={{ color: "hsl(210 100% 56%)" }}>
            + New
          </button>
        </div>
        {chats.map((chat, i) => (
          <div key={i}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer group"
            style={{ backgroundColor: "hsl(210 100% 56% / 0.1)" }}>
            <p className="text-xs truncate"
              style={{ color: "hsl(210 100% 56%)" }}>
              {chat}
            </p>
            <button
              onClick={() => setChats((prev) => prev.filter((_, j) => j !== i))}
              className="text-xs ml-1 opacity-0 group-hover:opacity-100"
              style={{ color: "hsl(0 100% 60%)" }}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden"
        style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

        {/* Title */}
        <div className="px-6 py-4"
          style={{ borderBottom: "1px solid hsl(217 33% 17%)" }}>
          <h1 className="text-xl font-bold"
            style={{
              background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            Copilot
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-lg px-4 py-3 rounded-xl text-sm"
                style={{
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, hsl(210 100% 56%), hsl(142 71% 45%))"
                    : "hsl(220 47% 8%)",
                  color: msg.role === "user" ? "white" : "hsl(210 40% 98%)",
                  border: msg.role === "assistant" ? "1px solid hsl(217 33% 17%)" : "none",
                }}>
                <p className="font-semibold text-xs mb-1 opacity-70">
                  {msg.role === "user" ? "You" : "Grace AI"}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "hsl(220 47% 8%)", border: "1px solid hsl(217 33% 17%)" }}>
                <p className="font-semibold text-xs mb-1 opacity-70">Grace AI</p>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "hsl(210 100% 56%)", animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "hsl(210 100% 56%)", animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "hsl(210 100% 56%)", animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 flex gap-3"
          style={{ borderTop: "1px solid hsl(217 33% 17%)" }}>
          <input
            placeholder="Ask Grace AI anything about your startup..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-lg px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
              color: "white",
              opacity: isLoading ? 0.7 : 1,
            }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
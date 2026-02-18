import { useState, useRef, useCallback } from "react";
import { streamChat, type Msg } from "@/lib/ai-stream";
import { supabase } from "@/integrations/supabase/client";

export function useChat(mode: "code" | "learn" | "debug" | "playtest" = "code") {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (input: string) => {
    const userMsg: Msg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Create conversation if first message
    let convId = conversationId;
    if (!convId) {
      const { data } = await supabase
        .from("conversations")
        .insert({ title: input.slice(0, 50) })
        .select("id")
        .single();
      if (data) {
        convId = data.id;
        setConversationId(data.id);
      }
    }

    // Save user message
    if (convId) {
      await supabase.from("chat_messages").insert({
        conversation_id: convId,
        role: "user",
        content: input,
      });
    }

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages,
        mode,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: async () => {
          setIsLoading(false);
          if (convId && assistantSoFar) {
            await supabase.from("chat_messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: assistantSoFar,
            });
          }
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      const errorMsg = e instanceof Error ? e.message : "An error occurred";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    }
  }, [messages, conversationId, mode]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at");
    if (data) {
      setMessages(
        data.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }))
      );
      setConversationId(id);
    }
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    if (id === conversationId) {
      clearChat();
    }
  }, [conversationId, clearChat]);

  return {
    messages,
    isLoading,
    send,
    clearChat,
    conversationId,
    loadConversation,
    deleteConversation,
  };
}

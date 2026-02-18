import { useState, useEffect } from "react";
import { Bot, X, MessageSquare, Brain, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useChat } from "@/hooks/use-chat";
import ChatWindow from "./ChatWindow";

interface AiBotProps {
  mode?: "code" | "learn" | "debug" | "playtest";
}

const AiBot = ({ mode = "code" }: AiBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const chat = useChat(mode);

  useEffect(() => {
    if (showMemory) {
      supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .then(({ data }) => {
          if (data) setConversations(data);
        });
    }
  }, [showMemory]);

  const deleteAllMemories = async () => {
    await supabase.from("conversations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setConversations([]);
    chat.clearChat();
  };

  return (
    <>
      {/* Floating AI Bot Character */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary flex items-center justify-center glow-green cursor-pointer"
          >
            <Bot className="w-8 h-8 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] max-h-[80vh] bg-card border border-border rounded-xl flex flex-col overflow-hidden glow-green"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-display text-sm font-semibold text-primary text-glow-green">
                  CodeBot
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {mode === "learn" ? "TUTOR" : mode === "debug" ? "DEBUG" : mode === "playtest" ? "TEST" : "ASSIST"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowMemory(!showMemory)}
                  className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Chat Memories"
                >
                  <Brain className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { chat.clearChat(); }}
                  className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="New Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Memory Panel */}
            <AnimatePresence>
              {showMemory && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-b border-border"
                >
                  <div className="p-3 max-h-48 overflow-y-auto bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved Chats</span>
                      <button
                        onClick={deleteAllMemories}
                        className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    </div>
                    {conversations.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No saved chats yet.</p>
                    ) : (
                      conversations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            chat.loadConversation(c.id);
                            setShowMemory(false);
                          }}
                          className="w-full text-left p-2 rounded text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between group"
                        >
                          <span className="truncate text-foreground">{c.title}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              chat.deleteConversation(c.id);
                              setConversations((prev) => prev.filter((x) => x.id !== c.id));
                            }}
                            className="opacity-0 group-hover:opacity-100 text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Content */}
            <ChatWindow
              messages={chat.messages}
              isLoading={chat.isLoading}
              onSend={chat.send}
              placeholder={
                mode === "learn"
                  ? "What do you want to learn?"
                  : mode === "debug"
                  ? "Paste your code to debug..."
                  : mode === "playtest"
                  ? "Describe what to test..."
                  : "Ask me anything about code..."
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiBot;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { streamChatQA } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPanel = ({ storyTitle, articleContext = "" }: { storyTitle: string; articleContext?: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const suggestedQuestions = [
    "What does this mean for retail investors?",
    "Who benefits the most from this?",
    "What are the risks?",
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChatQA({
        messages: newMessages,
        articleContext,
        storyTitle,
        onDelta: upsertAssistant,
        onDone: () => setIsTyping(false),
      });
    } catch (err: any) {
      console.error("Chat error:", err);
      setIsTyping(false);
      toast({
        title: "Chat error",
        description: err.message || "Failed to get a response",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4 text-gold" />
        <h2 className="font-display text-lg font-semibold text-foreground">Ask About This Story</h2>
      </div>

      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-xs text-dim mb-3">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-gold-dim hover:text-gold transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <Bot className="w-5 h-5 text-gold shrink-0 mt-1" />
                )}
                <div
                  className={`text-sm px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <User className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-2 items-center">
              <Bot className="w-5 h-5 text-gold" />
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
          disabled={isTyping}
        />
        <Button
          type="submit"
          size="icon"
          className="gradient-gold text-primary-foreground shrink-0"
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </motion.section>
  );
};

export default ChatPanel;

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import api from "../api/axios";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your CareerCompass AI assistant. Ask me about careers, skill gaps, your resume, interviews, or jobs." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.post("/chat", { message: text });
      setMessages((m) => [...m, { role: "assistant", text: res.data.reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't process that right now." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm glass-card rounded-2xl shadow-glass-lg flex flex-col overflow-hidden"
            style={{ height: "28rem" }}
          >
            <div className="flex items-center gap-2 bg-brand-gradient px-4 py-3 text-white">
              <Sparkles size={18} />
              <span className="font-semibold text-sm">CareerCompass Assistant</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-brand-gradient text-white"
                      : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {sending && (
                <div className="bg-slate-100 dark:bg-white/10 rounded-2xl px-3 py-2 text-sm w-16 text-slate-400">
                  ...
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-white/20 p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about your career..."
                className="input-field flex-1 text-sm"
              />
              <button onClick={sendMessage} className="btn-primary p-2.5" disabled={sending}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glass-lg hover:scale-105 transition-transform"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}

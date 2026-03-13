"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Loader2, ShoppingBag, ChevronRight } from "lucide-react";

// ─── Quick suggestion chips ─────────────────────────────────────────────────
const QUICK_CHIPS = [
  "Show me Rugs",
  "Natural Rugs",
  "Machine Made",
  "Poufs & Pillows",
  "Outdoor Rugs",
  "Remnant Carpets",
];

// ─── Markdown-like formatter ─────────────────────────────────────────────────
function FormattedText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold lines: **text**
        const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
        return (
          <p
            key={i}
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}

// ─── Product Card inside chat ─────────────────────────────────────────────────
function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="block bg-white border border-gray-100 rounded-xl p-3 hover:border-primary/50 hover:shadow-md transition-all group mt-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-primary transition-colors">
            🏷️ {product.name}
          </p>
          {product.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary mt-0.5 flex-shrink-0" />
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {product.material && (
          <span className="inline-flex items-center text-[10px] bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 font-medium border border-amber-100">
            🧶 {product.material}
          </span>
        )}
        {product.sizes?.slice(0, 3).map((s, i) => (
          <span key={i} className="inline-flex items-center text-[10px] bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 font-medium border border-blue-100">
            📏 {s}
          </span>
        ))}
      </div>

      {product.colors?.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[10px] text-gray-400 mr-0.5">🎨</span>
          {product.colors.slice(0, 5).map((c, i) => (
            <span key={i} className="text-[10px] text-gray-600 bg-gray-100 rounded-full px-1.5 py-0.5">
              {c}
            </span>
          ))}
          {product.colors.length > 5 && (
            <span className="text-[10px] text-gray-400">+{product.colors.length - 5}</span>
          )}
        </div>
      )}
    </Link>
  );
}

// ─── Single message bubble ─────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
          <ShoppingBag className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {isUser ? (
          <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm">
            {msg.content}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-2 text-gray-700 border border-gray-100">
            {msg.reply?.text && <FormattedText text={msg.reply.text} />}
            {msg.reply?.products?.map((p, i) => <ProductCard key={i} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (!hasOpened) {
        setHasOpened(true);
        sendGreeting();
      }
    }
  }, [isOpen]);

  const sendGreeting = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
      });
      const data = await res.json();
      setMessages([{
        role: "assistant",
        reply: {
          text: `👋 **Welcome to Sumaiya Home.**\n\nI'm your personal shopping assistant, Can I help you today?\n\n **Rugs:** Natural, Machine Made, and Novelty styles\n **Accents:** Cozy Poufs, Pillows, and Throws\n **Outdoor:** Weather-resistant Outdoor Rugs\n **Value:** High-quality Remnant Carpets\n\nHow can I help you today? Simply ask:\n*"Show me a 5x7 blue rug"* or *"I'm looking for natural rugs."*`
        },
      }]);
    } catch {
      setMessages([{
        role: "assistant",
        reply: { text: "👋 Welcome to Sumaiya Home! How can I help you today?" },
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content || m.reply?.text || "",
          })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", reply: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        reply: { text: "❌ Something went wrong. Please try again." },
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-800 rotate-90"
            : "bg-primary hover:bg-primary/90"
        }`}
        aria-label="Shopping Assistant"
      >
        {isOpen
          ? <X className="w-6 h-6 text-white" />
          : <MessageSquare className="w-6 h-6 text-white" />
        }
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
        style={{ height: "520px" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 bg-primary rounded-t-2xl">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Shopping Assistant</p>
            <p className="text-white/70 text-xs">Sumaiya Home • Online</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2">
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* ── Quick Chips ── */}
        {messages.length <= 1 && (
          <div className="px-3 pb-1 flex gap-1.5 flex-wrap">
            {QUICK_CHIPS.map((chip, i) => (
              <button
                key={i}
                onClick={() => sendMessage(chip)}
                disabled={isLoading}
                className="text-[11px] bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-1 transition-colors font-medium disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-primary/50 focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 5x7 blue outdoor rug..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white disabled:opacity-40 hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

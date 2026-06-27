"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, User, Phone } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "visitor" | "ai" | "human";
  content: string;
  adminName?: string;
  createdAt: string;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("chat_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_visitor_id", id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [waitingHuman, setWaitingHuman] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [visitorInfo, setVisitorInfo] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [collectingInfo, setCollectingInfo] = useState(true);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const visitorId = getVisitorId();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = () => {
    if (!visitorId) return;
    fetch(`/api/chat?visitorId=${visitorId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.conversation) {
          setConversationId(data.conversation.id);
          setMessages(
            data.conversation.messages.map((m: ChatMessage) => ({
              ...m,
              createdAt: m.createdAt,
            }))
          );
          setWaitingHuman(data.conversation.status === "waiting_human");
          if (data.conversation.messages.length > 0) {
            setCollectingInfo(false);
            setVisitorInfo({ name: "", phone: "" });
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!open) return;
    // Check if already has a conversation
    if (!visitorId) return;
    fetch(`/api/chat?visitorId=${visitorId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.conversation && data.conversation.messages.length > 0) {
          setCollectingInfo(false);
          setVisitorInfo({ name: "", phone: "" });
          setConversationId(data.conversation.id);
          setMessages(
            data.conversation.messages.map((m: ChatMessage) => ({
              ...m,
              createdAt: m.createdAt,
            }))
          );
          setWaitingHuman(data.conversation.status === "waiting_human");
        }
      })
      .catch(() => {});
  }, [open, visitorId]);

  useEffect(() => {
    if (!open || collectingInfo) return;
    const interval = setInterval(loadConversation, 5000);
    return () => clearInterval(interval);
  }, [open, visitorId, collectingInfo]);

  const submitVisitorInfo = async () => {
    if (!visitorName.trim() || !visitorPhone.trim()) return;
    setVisitorInfo({ name: visitorName.trim(), phone: visitorPhone.trim() });
    setCollectingInfo(false);

    // Send initial greeting to create conversation + lead
    const greeting = `Olá! Meu nome é ${visitorName.trim()} e meu WhatsApp é ${visitorPhone.trim()}.`;
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "visitor",
        content: greeting,
        createdAt: new Date().toISOString(),
      },
    ]);
    setLoading(true);
    setShowBadge(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          name: visitorName.trim(),
          phone: visitorPhone.trim(),
          message: greeting,
        }),
      });
      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "ai",
            content: data.message,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      if (data.waitingHuman) setWaitingHuman(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: "Erro ao conectar. Tente novamente.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setShowBadge(false);

    const tempId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        role: "visitor",
        content: msg,
        createdAt: new Date().toISOString(),
      },
    ]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          message: msg,
          conversationId,
          name: visitorInfo?.name,
          phone: visitorInfo?.phone,
        }),
      });
      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "ai",
            content: data.message,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      if (data.waitingHuman) setWaitingHuman(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: "Erro ao enviar mensagem. Tente novamente.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all flex items-center justify-center group"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          {showBadge && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              1
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-3rem)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  J4 Sistemas
                </h3>
                <p className="text-blue-100 text-xs">
                  {collectingInfo
                    ? "👋 Bem-vindo!"
                    : waitingHuman
                    ? "⏳ Aguardando atendente..."
                    : "🟢 Assistente virtual online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {collectingInfo ? (
              /* Visitor Info Form */
              <div className="p-6 space-y-5">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">
                    Olá! 👋
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Para iniciar o atendimento, informe seus dados:
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Como posso te chamar?"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        document.getElementById("chat-phone")?.focus();
                    }}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </label>
                  <input
                    id="chat-phone"
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitVisitorInfo();
                    }}
                  />
                </div>
                <button
                  onClick={submitVisitorInfo}
                  disabled={!visitorName.trim() || !visitorPhone.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Iniciar Atendimento
                </button>
              </div>
            ) : (
              /* Messages */
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "visitor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "visitor"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : msg.role === "human"
                          ? "bg-emerald-600/20 border border-emerald-600/30 text-emerald-200 rounded-bl-md"
                          : "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-md"
                      }`}
                    >
                      {msg.role === "human" && msg.adminName && (
                        <p className="text-[10px] text-emerald-400 font-semibold mb-1">
                          👤 {msg.adminName}
                        </p>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            )}
          </div>

          {/* Input */}
          {!collectingInfo && (
            <div className="border-t border-gray-700 p-3 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    waitingHuman
                      ? "Aguardando atendente..."
                      : "Digite sua mensagem..."
                  }
                  disabled={loading}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
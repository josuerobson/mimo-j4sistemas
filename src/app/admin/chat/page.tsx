"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
import {
  MessagesSquare,
  Send,
  RefreshCw,
  User,
  Bot,
  UserCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  X,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "visitor" | "ai" | "human";
  content: string;
  adminName?: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  visitorId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  _count: { messages: number };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: {
    label: "Ativa",
    color: "bg-blue-500/20 text-blue-400",
    icon: <MessageCircle className="w-3.5 h-3.5" />,
  },
  waiting_human: {
    label: "Aguardando humano",
    color: "bg-amber-500/20 text-amber-400",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  resolved: {
    label: "Resolvida",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = () => {
    setLoading(true);
    setError(null);
    fetch("/api/chat/admin")
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({ error: "Erro desconhecido" }));
          throw new Error(err.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.warn("Expected array, got:", data);
          setConversations([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch conversations:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/chat?conversationId=${id}`);
      const data = await res.json();
      if (data.conversation) {
        setSelected(data.conversation as Conversation);
      } else {
        console.warn("No conversation found for id:", id);
      }
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    await fetch("/api/chat/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selected.id,
        message: reply.trim(),
      }),
    });
    setReply("");
    await fetchConversation(selected.id);
    fetchConversations();
    setSending(false);
  };

  const resolveConversation = async () => {
    if (!selected) return;
    await fetch("/api/chat/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selected.id }),
    });
    setSelected(null);
    fetchConversations();
  };

  const waitingCount = conversations.filter(
    (c) => c.status === "waiting_human"
  ).length;

  return (
    <DashboardShell>
      <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
        {/* Conversations List */}
        <div className="lg:w-80 flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessagesSquare className="w-6 h-6" />
                Chat
              </h1>
              {waitingCount > 0 && (
                <p className="text-amber-400 text-sm mt-1">
                  {waitingCount} conversa{waitingCount > 1 ? "s" : ""} aguardando atendimento
                </p>
              )}
            </div>
            <button
              onClick={fetchConversations}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 text-xs mt-2">Carregando conversas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
                <button
                  onClick={fetchConversations}
                  className="mt-2 text-xs text-blue-400 hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessagesSquare className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nenhuma conversa ativa</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const cfg = statusConfig[conv.status] || statusConfig.active;
                return (
                  <button
                    key={conv.id}
                    onClick={() => fetchConversation(conv.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selected?.id === conv.id
                        ? "bg-gray-800 border-blue-500/50"
                        : conv.status === "waiting_human"
                        ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40"
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">
                        {conv.visitorName || "Visitante anônimo"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                    {lastMsg && (
                      <p className="text-xs text-gray-500 truncate">
                        {lastMsg.role === "visitor" ? "👤" : lastMsg.role === "ai" ? "🤖" : "👨‍💼"}{" "}
                        {lastMsg.content}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-600 mt-1">
                      {conv._count.messages} mensagens ·{" "}
                      {new Date(conv.updatedAt).toLocaleString("pt-BR")}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Detail */}
        <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessagesSquare className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <h3 className="text-gray-400 font-semibold">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Escolha uma conversa ao lado para responder
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div>
                  <h3 className="font-semibold text-white">
                    {selected.visitorName || "Visitante anônimo"}
                  </h3>
                  {selected.visitorEmail && (
                    <p className="text-xs text-gray-500">
                      {selected.visitorEmail}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {selected.status !== "resolved" && (
                    <button
                      onClick={resolveConversation}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolver
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "visitor" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "visitor"
                          ? "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-md"
                          : msg.role === "human"
                          ? "bg-emerald-600/20 border border-emerald-600/30 text-emerald-200 rounded-br-md"
                          : "bg-blue-600/20 border border-blue-600/30 text-blue-200 rounded-br-md"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {msg.role === "visitor" && <User className="w-3 h-3 text-gray-500" />}
                        {msg.role === "ai" && <Bot className="w-3 h-3 text-blue-400" />}
                        {msg.role === "human" && <UserCheck className="w-3 h-3 text-emerald-400" />}
                        <span className="text-[10px] text-gray-500">
                          {msg.role === "visitor"
                            ? "Visitante"
                            : msg.role === "ai"
                            ? "IA"
                            : msg.adminName || "Humano"}
                        </span>
                        <span className="text-[10px] text-gray-600 ml-auto">
                          {new Date(msg.createdAt).toLocaleTimeString("pt-BR")}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              {selected.status !== "resolved" && (
                <div className="p-4 border-t border-gray-800">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendReply();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Digite sua resposta como atendente humano..."
                      disabled={sending}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={sending || !reply.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Responder
                    </button>
                  </form>
                </div>
              )}
              {selected.status === "resolved" && (
                <div className="p-4 border-t border-gray-800 text-center">
                  <p className="text-emerald-400 text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Conversa resolvida
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
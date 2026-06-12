'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';
import { api } from '@/lib/api';
import { matchFaq } from '@/lib/chatFaq';

interface ChatLine {
    id: number;
    text: string;
    from: 'user' | 'bot';
    /** When true, render the WhatsApp fallback button under this line. */
    showWhatsApp?: boolean;
}

// Local number 01827621312 → international WhatsApp format (+880, drop leading 0).
const WHATSAPP_NUMBER = '8801827621312';
const WHATSAPP_DISPLAY = '01827621312';

// Free mode by default: the chat uses the built-in FAQ matcher + WhatsApp handoff,
// with no paid AI calls. Set NEXT_PUBLIC_AI_CHAT=true (and an ANTHROPIC_API_KEY on
// the backend) to also route questions through the AI assistant first.
const AI_ENABLED = process.env.NEXT_PUBLIC_AI_CHAT === 'true';
function whatsAppLink(prefill: string) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefill)}`;
}

const initialBot: ChatLine = {
    id: 1,
    from: 'bot',
    text: 'Hi! 👋 How can I help you today? Ask me about orders, shipping, returns, or anything else.',
};

const quickReplies = ['Track my order', 'Return / refund', 'Product question', 'Payment issue'];

export default function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatLine[]>([initialBot]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to newest message.
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isOpen]);

    const appendUser = (text: string) =>
        setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text }]);
    const appendBot = (text: string, showWhatsApp = false) =>
        setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text, showWhatsApp }]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        // Append the user's message optimistically.
        appendUser(text);
        setInput('');
        setSending(true);

        // Trimmed transcript (last 12 lines) shared with both the AI and the email.
        const history = messages.slice(-12).map((m) => ({ from: m.from, text: m.text }));

        // 1) (Optional, paid) Ask the AI assistant — only when AI mode is on.
        if (AI_ENABLED) {
            try {
                const res = await api.post<{
                    data: { canAnswer: boolean; reply: string; aiEnabled: boolean };
                }>('/chat-ai', { message: text, history });
                const { canAnswer, reply, aiEnabled } = res.data;

                // AI answered confidently — show its reply, done.
                if (aiEnabled && canAnswer && reply.trim()) {
                    appendBot(reply.trim());
                    setSending(false);
                    return;
                }
                // AI couldn't answer — use its apology (if any) + WhatsApp.
                if (aiEnabled) {
                    await handoffToTeam(text, history, reply.trim());
                    return;
                }
                // AI not configured on the backend → fall through to FAQ below.
            } catch {
                // AI endpoint failed → fall through to the FAQ below.
            }
        }

        // 2) Free path: answer instantly from the built-in FAQ knowledge base.
        const local = matchFaq(text);
        if (local) {
            // Tiny delay so the typing indicator reads as a real reply.
            window.setTimeout(() => {
                appendBot(local);
                setSending(false);
            }, 400);
            return;
        }

        // 3) No FAQ match — note it for the team AND offer WhatsApp.
        await handoffToTeam(text, history);
    };

    // Log the unanswered question for the team and show the WhatsApp handoff.
    const handoffToTeam = async (
        text: string,
        history: { from: 'user' | 'bot'; text: string }[],
        aiApology = '',
    ) => {
        const intro = aiApology || 'I’m not sure about that one 🤔';
        // Best-effort: let the team see what was asked. We don't block the
        // WhatsApp handoff on it — WhatsApp is the real reply channel now.
        try {
            await api.post('/chat-message', { message: text, history });
        } catch {
            /* ignore — WhatsApp below is the reliable path */
        }
        appendBot(
            `${intro}\n\nFor a quick answer, message us directly on WhatsApp (${WHATSAPP_DISPLAY}):`,
            true,
        );
        setSending(false);
    };

    return (
        <>
            {/* Trigger — brand accent gradient + breathing online dot */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-accent to-accent-700 text-white w-14 h-14 rounded-full shadow-xl shadow-accent/30 flex items-center justify-center"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                        <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="w-5 h-5" />
                        </motion.span>
                    ) : (
                        <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                            <MessageCircle className="w-5 h-5" />
                        </motion.span>
                    )}
                </AnimatePresence>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </motion.button>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        className="fixed bottom-24 left-6 right-6 sm:left-auto sm:w-[380px] z-40 bg-white dark:bg-ink-900 border border-primary/10 dark:border-slate-700 rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/50 overflow-hidden flex flex-col max-h-[70vh]"
                    >
                        {/* Header */}
                        <div className="shrink-0 bg-gradient-to-br from-accent-900 via-accent-800 to-accent-950 text-white p-5 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/40 rounded-full blur-2xl" />
                            <div className="relative flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-medium tracking-tight text-base">Live Support</h3>
                                    <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Online — replies within 24h
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-gray-50/60 dark:bg-ink-900/40">
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${m.from === 'bot' ? 'items-start' : 'items-end'}`}
                                >
                                    <div
                                        className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${m.from === 'bot'
                                            ? 'bg-white dark:bg-ink-800 text-primary dark:text-white rounded-2xl rounded-bl-md border border-primary/5 dark:border-slate-700'
                                            : 'bg-primary dark:bg-accent text-white rounded-2xl rounded-br-md'
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                    {m.showWhatsApp && (
                                        <a
                                            href={whatsAppLink('Hi LuxeCart, I need help.')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium shadow-md shadow-[#25D366]/30 hover:brightness-105 active:scale-95 transition"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                                                <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.5.07-.77.37-.27.3-1.02 1-1.02 2.42 0 1.43 1.04 2.8 1.19 3 .15.2 2.05 3.12 4.96 4.38.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.13-.27-.2-.56-.35zM12.01 2.4c-5.31 0-9.62 4.31-9.62 9.62 0 1.7.44 3.36 1.29 4.82L2.4 21.6l4.9-1.28a9.6 9.6 0 0 0 4.7 1.2h.01c5.3 0 9.61-4.31 9.61-9.62 0-2.57-1-4.98-2.82-6.8a9.56 9.56 0 0 0-6.8-2.82z" />
                                            </svg>
                                            Chat on WhatsApp
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                            {sending && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-ink-800 border border-primary/5 dark:border-slate-700 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick replies — one-tap common questions */}
                        <div className="shrink-0 px-4 py-3 border-t border-primary/5 dark:border-slate-800 flex flex-wrap gap-1.5">
                            {quickReplies.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setInput(q)}
                                    disabled={sending}
                                    className="text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/10 dark:border-slate-700 text-secondary dark:text-gray-400 hover:border-accent hover:text-accent disabled:opacity-50 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="shrink-0 p-3 border-t border-primary/5 dark:border-slate-800 flex gap-2 bg-white dark:bg-ink-900">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message…"
                                disabled={sending}
                                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 dark:bg-ink-800 rounded-full focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white placeholder:text-gray-400 disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={sending || !input.trim()}
                                aria-label="Send"
                                className="w-10 h-10 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

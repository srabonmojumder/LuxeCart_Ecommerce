'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';

interface ChatLine {
    id: number;
    text: string;
    from: 'user' | 'bot';
}

const STORAGE_EMAIL_KEY = 'luxecart-chat-email';

const initialBot: ChatLine = {
    id: 1,
    from: 'bot',
    text: "Hi! What's your email so we can reply to you?",
};

const quickReplies = ['Track my order', 'Return / refund', 'Product question', 'Payment issue'];

function isEmail(s: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatLine[]>([initialBot]);
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Remember the email between opens (so returning users skip the prompt).
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_EMAIL_KEY);
            if (saved) {
                setEmail(saved);
                setMessages([
                    { id: 1, from: 'bot', text: `Welcome back! Type your question and we'll reply to ${saved}.` },
                ]);
            }
        } catch {
            /* ignore */
        }
    }, []);

    // Auto-scroll to newest message.
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isOpen]);

    const appendUser = (text: string) =>
        setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text }]);
    const appendBot = (text: string) =>
        setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text }]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        // Capture email on the first turn (if we don't have one yet).
        if (!email) {
            if (!isEmail(text)) {
                appendUser(text);
                appendBot("That doesn't look like an email — could you double-check? (e.g. you@example.com)");
                setInput('');
                return;
            }
            setEmail(text);
            try { localStorage.setItem(STORAGE_EMAIL_KEY, text); } catch { /* ignore */ }
            appendUser(text);
            appendBot('Thanks! Now tell us how we can help.');
            setInput('');
            return;
        }

        // Send the message — append optimistically, then POST.
        appendUser(text);
        setInput('');
        setSending(true);
        try {
            // Build a trimmed transcript (last 12 lines) for context in the email.
            const history = messages.slice(-12).map((m) => ({ from: m.from, text: m.text }));
            await api.post('/chat-message', { email, message: text, history });
            appendBot(`Sent ✓ Our team will reply to ${email} within 24 hours. Add more details if you'd like.`);
        } catch (err) {
            appendBot('Sorry — couldn\'t send that. Please try again in a moment.');
            toast.error(err instanceof ApiError ? err.message : 'Chat failed');
        } finally {
            setSending(false);
        }
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
                        className="fixed bottom-24 left-6 right-6 sm:left-auto sm:w-[380px] z-40 bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-700 rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/50 overflow-hidden flex flex-col max-h-[70vh]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-br from-accent-900 via-accent-800 to-accent-950 text-white p-5 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/40 rounded-full blur-2xl" />
                            <div className="relative flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black tracking-tight text-base">Live Support</h3>
                                    <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Online — replies within 24h
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60 dark:bg-slate-900/40">
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${m.from === 'bot'
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-white rounded-2xl rounded-bl-md border border-primary/5 dark:border-slate-700'
                                            : 'bg-primary dark:bg-accent text-white rounded-2xl rounded-br-md'
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {sending && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 border border-primary/5 dark:border-slate-700 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick replies — only when we have email (otherwise it'd send before capture) */}
                        {email && (
                            <div className="px-4 py-3 border-t border-primary/5 dark:border-slate-800 flex flex-wrap gap-1.5">
                                {quickReplies.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        disabled={sending}
                                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/10 dark:border-slate-700 text-secondary dark:text-gray-400 hover:border-accent hover:text-accent disabled:opacity-50 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-primary/5 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
                            <input
                                type={email ? 'text' : 'email'}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={email ? 'Type a message…' : 'Your email first…'}
                                disabled={sending}
                                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white placeholder:text-gray-400 disabled:opacity-60"
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

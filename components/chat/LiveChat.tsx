'use client';

import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Hi! How can I help you today?',
            isBot: true,
            time: 'Just now',
        },
    ]);
    const [input, setInput] = useState('');

    const quickReplies = [
        'Track my order',
        'Product information',
        'Return policy',
        'Payment options',
    ];

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: input,
            isBot: false,
            time: 'Just now',
        };

        setMessages([...messages, userMessage]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: 'Thanks for your message! A support agent will be with you shortly.',
                isBot: true,
                time: 'Just now',
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    const handleQuickReply = (reply: string) => {
        setInput(reply);
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 left-6 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-40 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Live Support</h3>
                                        <p className="text-xs text-white/80">Online now</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-3">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.isBot
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p
                                            className={`text-xs mt-1 ${message.isBot
                                                ? 'text-gray-500 dark:text-gray-400'
                                                : 'text-white/70'
                                                }`}
                                        >
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Replies */}
                        <div className="px-4 pb-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick replies:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickReplies.map((reply) => (
                                    <button
                                        key={reply}
                                        onClick={() => handleQuickReply(reply)}
                                        className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

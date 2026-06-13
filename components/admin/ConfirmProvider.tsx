'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const SKY = '#46AEE8';

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

type ConfirmFn = (opts: string | ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Imperative confirm dialog. `if (!(await confirm('Delete this?'))) return;` */
export function useConfirm(): ConfirmFn {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm must be used within <ConfirmProvider>');
    return ctx;
}

export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [opts, setOpts] = useState<ConfirmOptions>({ message: '' });
    const resolver = useRef<((v: boolean) => void) | null>(null);

    const confirm = useCallback<ConfirmFn>((arg) => {
        const o = typeof arg === 'string' ? { message: arg } : arg;
        setOpts(o);
        setOpen(true);
        return new Promise<boolean>((resolve) => { resolver.current = resolve; });
    }, []);

    const close = (result: boolean) => {
        setOpen(false);
        resolver.current?.(result);
        resolver.current = null;
    };

    const danger = opts.danger ?? true; // admin confirms are mostly destructive

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => close(false)}
                        />
                        <motion.div role="alertdialog" aria-modal="true"
                            initial={{ opacity: 0, scale: 0.94, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 8 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6 text-center">
                            <span className={`mx-auto mb-4 flex w-14 h-14 items-center justify-center rounded-2xl ${danger ? 'bg-rose-50 text-rose-500' : 'bg-sky-50'}`}
                                style={!danger ? { color: SKY } : undefined}>
                                <AlertTriangle className="w-7 h-7" />
                            </span>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">
                                {opts.title || 'Are you sure?'}
                            </h2>
                            <p className="mt-1.5 text-sm text-slate-500">{opts.message}</p>
                            <div className="mt-6 flex gap-3">
                                <button onClick={() => close(false)}
                                    className="flex-1 h-11 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                                    {opts.cancelText || 'Cancel'}
                                </button>
                                <button onClick={() => close(true)} autoFocus
                                    className={`flex-1 h-11 rounded-2xl text-white font-bold text-sm transition-opacity hover:opacity-90 ${danger ? 'bg-rose-500' : ''}`}
                                    style={!danger ? { backgroundColor: SKY } : undefined}>
                                    {opts.confirmText || 'Yes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ConfirmContext.Provider>
    );
}

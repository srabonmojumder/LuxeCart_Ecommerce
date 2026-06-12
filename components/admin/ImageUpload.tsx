'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile, ApiError } from '@/lib/api';

/** Upload an image (or paste a URL) and surface the resulting URL to the parent. */
export default function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const pick = () => inputRef.current?.click();

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { url } = await uploadFile<{ url: string }>('/admin/uploads', file);
            onChange(url);
            toast.success('Image uploaded');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-gray-900 dark:text-white';

    return (
        <div className="space-y-2">
            <div className="flex items-start gap-3">
                {value ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 border border-primary/10 dark:border-slate-700">
                        <Image src={value} alt="preview" fill sizes="80px" className="object-cover" />
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                            aria-label="Remove image"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={pick}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/20 dark:border-slate-700 flex items-center justify-center text-gray-400 hover:border-[#46AEE8] hover:text-[#46AEE8] flex-shrink-0"
                    >
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </button>
                )}

                <div className="flex-1 space-y-2">
                    <button
                        type="button"
                        onClick={pick}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#46AEE8] text-white text-xs font-black uppercase tracking-widest disabled:opacity-60"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Uploading…' : 'Upload image'}
                    </button>
                    <input
                        className={field}
                        placeholder="…or paste an image URL"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </div>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
    );
}

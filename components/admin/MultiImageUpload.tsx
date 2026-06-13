'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile, ApiError } from '@/lib/api';

/**
 * Manage a product image gallery. The first image is the cover (primary).
 * Upload multiple files, paste URLs, remove, and pick any image as the cover.
 */
export default function MultiImageUpload({
    images,
    onChange,
}: {
    images: string[];
    onChange: (images: string[]) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');

    const pick = () => inputRef.current?.click();

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        setUploading(true);
        try {
            const uploaded: string[] = [];
            for (const file of files) {
                const { url: u } = await uploadFile<{ url: string }>('/admin/uploads', file);
                uploaded.push(u);
            }
            onChange([...images, ...uploaded].filter((v, i, a) => a.indexOf(v) === i));
            toast.success(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} uploaded`);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const addUrl = () => {
        const u = url.trim();
        if (!u) return;
        if (images.includes(u)) { toast.error('Image already added'); return; }
        onChange([...images, u]);
        setUrl('');
    };

    const remove = (img: string) => onChange(images.filter((i) => i !== img));
    const makeCover = (img: string) => onChange([img, ...images.filter((i) => i !== img)]);

    const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-gray-900 dark:text-white';

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Images {images.length > 0 && `(${images.length})`}
                </span>
                <span className="text-[10px] text-gray-400">First image = cover</span>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5">
                    {images.map((img, i) => (
                        <div
                            key={img}
                            className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border ${i === 0 ? 'border-[#46AEE8] ring-2 ring-[#46AEE8]/30' : 'border-primary/10 dark:border-slate-700'}`}
                        >
                            <Image src={img} alt={`Image ${i + 1}`} fill sizes="120px" className="object-cover" />
                            {i === 0 ? (
                                <span className="absolute top-1 left-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#46AEE8] text-white text-[9px] font-bold uppercase tracking-wide">
                                    <Star className="w-2.5 h-2.5 fill-white" /> Cover
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => makeCover(img)}
                                    title="Make cover"
                                    className="absolute top-1 left-1 p-1 rounded-md bg-black/50 text-white hover:bg-[#46AEE8]"
                                >
                                    <Star className="w-3 h-3" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => remove(img)}
                                aria-label="Remove image"
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={pick}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#46AEE8] text-white text-xs font-black uppercase tracking-widest disabled:opacity-60 flex-shrink-0"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Uploading…' : 'Upload'}
                </button>
                <input
                    className={field}
                    placeholder="…or paste an image URL + Enter"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                />
            </div>

            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        </div>
    );
}

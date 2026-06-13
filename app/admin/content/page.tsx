'use client';

import { useState, useEffect } from 'react';
import { LayoutTemplate, Sparkles, Tag, Megaphone, FileText, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useContent } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { FEATURE_ICON_KEYS } from '@/lib/featureIcons';
import type { SiteContent } from '@/lib/siteContent';
import { FormSkeleton } from '@/components/ui/Skeleton';
import Select from '@/components/ui/Select';

const SKY = '#46AEE8';
const field = 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-slate-800';
const label = 'text-[10px] font-black uppercase tracking-widest text-slate-400';

function Section({ icon: Icon, title, children }: { icon: typeof Home; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-base font-black text-slate-800">
                <Icon className="w-4 h-4" style={{ color: SKY }} /> {title}
            </h2>
            {children}
        </div>
    );
}

function Field({ label: l, value, onChange, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
    return (
        <div className="space-y-1.5">
            <label className={label}>{l}</label>
            {textarea
                ? <textarea className={field} rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
                : <input className={field} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
        </div>
    );
}

export default function AdminContentPage() {
    const { content, mutate } = useContent();
    const [form, setForm] = useState<SiteContent | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (content && !form) setForm(structuredClone(content)); }, [content, form]);

    if (!form) return <FormSkeleton fields={12} />;

    // Immutable nested edit helper.
    const edit = (fn: (draft: SiteContent) => void) => setForm((prev) => {
        const next = structuredClone(prev!);
        fn(next);
        return next;
    });

    const hp = form.homepage;

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/admin/content', form, true);
            toast.success('Content saved');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={save} className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Site Content</h1>
                <button type="submit" disabled={saving} className="px-10 py-3 text-white rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60" style={{ backgroundColor: SKY }}>
                    {saving ? 'Saving…' : 'Save Content'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                <Section icon={Home} title="Hero (fallback when no banners)">
                    <Field label="Eyebrow / Subtitle" value={hp.hero.subtitle} onChange={(v) => edit((d) => { d.homepage.hero.subtitle = v; })} />
                    <Field label="Title" value={hp.hero.title} onChange={(v) => edit((d) => { d.homepage.hero.title = v; })} />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Button Text" value={hp.hero.ctaText} onChange={(v) => edit((d) => { d.homepage.hero.ctaText = v; })} />
                        <Field label="Button Link" value={hp.hero.ctaLink} onChange={(v) => edit((d) => { d.homepage.hero.ctaLink = v; })} />
                    </div>
                </Section>

                <Section icon={LayoutTemplate} title="Homepage Section Titles">
                    <Field label="Best Sellers — Title" value={hp.bestSellers.title} onChange={(v) => edit((d) => { d.homepage.bestSellers.title = v; })} />
                    <Field label="Best Sellers — Subtitle" value={hp.bestSellers.subtitle} onChange={(v) => edit((d) => { d.homepage.bestSellers.subtitle = v; })} />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Numbers — Eyebrow" value={hp.numbers.eyebrow} onChange={(v) => edit((d) => { d.homepage.numbers.eyebrow = v; })} />
                        <Field label="Numbers — Title" value={hp.numbers.title} onChange={(v) => edit((d) => { d.homepage.numbers.title = v; })} />
                        <Field label="Collections — Eyebrow" value={hp.collections.eyebrow} onChange={(v) => edit((d) => { d.homepage.collections.eyebrow = v; })} />
                        <Field label="Collections — Title" value={hp.collections.title} onChange={(v) => edit((d) => { d.homepage.collections.title = v; })} />
                        <Field label="New Arrivals — Eyebrow" value={hp.newArrivals.eyebrow} onChange={(v) => edit((d) => { d.homepage.newArrivals.eyebrow = v; })} />
                        <Field label="New Arrivals — Title" value={hp.newArrivals.title} onChange={(v) => edit((d) => { d.homepage.newArrivals.title = v; })} />
                        <Field label="Testimonials — Eyebrow" value={hp.testimonials.eyebrow} onChange={(v) => edit((d) => { d.homepage.testimonials.eyebrow = v; })} />
                        <Field label="Testimonials — Title" value={hp.testimonials.title} onChange={(v) => edit((d) => { d.homepage.testimonials.title = v; })} />
                    </div>
                </Section>
            </div>

            <Section icon={Sparkles} title="Trust / Features Strip">
                <p className="text-xs text-slate-400 -mt-1">First card&apos;s blank description auto-shows the live free-shipping amount.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {form.features.map((f, i) => (
                        <div key={i} className="rounded-2xl border border-slate-100 p-4 space-y-3">
                            <div className="grid grid-cols-[110px_1fr] gap-3">
                                <div className="space-y-1.5">
                                    <label className={label}>Icon</label>
                                    <Select
                                        className={field}
                                        value={f.icon}
                                        onChange={(v) => edit((d) => { d.features[i].icon = v; })}
                                        options={FEATURE_ICON_KEYS.map((k) => ({ value: k, label: k }))}
                                    />
                                </div>
                                <Field label="Title" value={f.title} onChange={(v) => edit((d) => { d.features[i].title = v; })} />
                            </div>
                            <Field label="Description" value={f.desc} onChange={(v) => edit((d) => { d.features[i].desc = v; })} placeholder={i === 0 ? 'Leave blank → live free-shipping amount' : ''} />
                        </div>
                    ))}
                </div>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                <Section icon={Tag} title="Limited Offer + Countdown">
                    <Field label="Eyebrow" value={hp.promo.eyebrow} onChange={(v) => edit((d) => { d.homepage.promo.eyebrow = v; })} />
                    <Field label="Fallback Title (no sale product)" value={hp.promo.fallbackTitle} onChange={(v) => edit((d) => { d.homepage.promo.fallbackTitle = v; })} />
                    <Field label="Fallback Text" textarea value={hp.promo.fallbackText} onChange={(v) => edit((d) => { d.homepage.promo.fallbackText = v; })} />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={label}>Flash Sale Hours</label>
                            <input type="number" className={field} value={form.promo.flashSaleHours} onChange={(e) => edit((d) => { d.promo.flashSaleHours = Number(e.target.value) || 0; })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className={label}>Deal Countdown Hours</label>
                            <input type="number" className={field} value={form.promo.dealHours} onChange={(e) => edit((d) => { d.promo.dealHours = Number(e.target.value) || 0; })} />
                        </div>
                    </div>
                </Section>

                <Section icon={Megaphone} title="Mega-Menu Promo Banners">
                    <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
                        <p className={label}>Shop menu</p>
                        <Field label="Image URL" value={form.promo.megaMenu.tech.image} onChange={(v) => edit((d) => { d.promo.megaMenu.tech.image = v; })} />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Title" value={form.promo.megaMenu.tech.title} onChange={(v) => edit((d) => { d.promo.megaMenu.tech.title = v; })} />
                            <Field label="Caption" value={form.promo.megaMenu.tech.discount} onChange={(v) => edit((d) => { d.promo.megaMenu.tech.discount = v; })} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
                        <p className={label}>Pages menu</p>
                        <Field label="Image URL" value={form.promo.megaMenu.support.image} onChange={(v) => edit((d) => { d.promo.megaMenu.support.image = v; })} />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Title" value={form.promo.megaMenu.support.title} onChange={(v) => edit((d) => { d.promo.megaMenu.support.title = v; })} />
                            <Field label="Caption" value={form.promo.megaMenu.support.discount} onChange={(v) => edit((d) => { d.promo.megaMenu.support.discount = v; })} />
                        </div>
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                <Section icon={Sparkles} title="Newsletter">
                    <Field label="Title" value={hp.newsletter.title} onChange={(v) => edit((d) => { d.homepage.newsletter.title = v; })} />
                    <Field label="Subtitle" textarea value={hp.newsletter.subtitle} onChange={(v) => edit((d) => { d.homepage.newsletter.subtitle = v; })} />
                    <Field label="Footer Tagline" textarea value={form.footer.tagline} onChange={(v) => edit((d) => { d.footer.tagline = v; })} />
                </Section>

                <Section icon={FileText} title="About Page">
                    <Field label="Title" value={form.pages.about.title} onChange={(v) => edit((d) => { d.pages.about.title = v; })} />
                    <Field label="Intro Text" textarea value={form.pages.about.body} onChange={(v) => edit((d) => { d.pages.about.body = v; })} />
                </Section>
            </div>

            <button type="submit" disabled={saving} className="w-full sm:w-auto px-12 py-3.5 text-white rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60" style={{ backgroundColor: SKY }}>
                {saving ? 'Saving…' : 'Save Content'}
            </button>
        </form>
    );
}

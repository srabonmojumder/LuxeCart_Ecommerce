'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
import {
    ArrowRight,
    Star,
    Truck,
    Shield,
    RotateCcw,
    Zap,
    Quote,
    Package,
    Users,
    ShoppingBag,
    Sparkles,
    BadgeCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton';
import RecentlyViewedSection from '@/components/product/RecentlyViewedSection';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import HeroCarousel from '@/components/ui/HeroCarousel';
import FlashSaleSection from '@/components/sections/FlashSaleSection';
import Reveal from '@/components/anim/Reveal';
import {
    useProducts,
    useBanners,
    useFeaturedProducts,
    useBestsellers,
    useNewArrivals,
    useCategories,
    usePublicStats,
    useTestimonials,
    type Testimonial,
} from '@/lib/hooks';
import { api } from '@/lib/api';
import { generateWebSiteSchema } from '@/lib/seo';

const FALLBACK_CAT_IMAGE = '/home_accessories_hero.png';

/** A single testimonial card — used inside the two marquee rows. */
function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <div className="group relative overflow-hidden flex flex-col gap-5 w-[300px] sm:w-[360px] shrink-0 mr-5 bg-white dark:bg-ink-900 border border-primary/5 dark:border-white/8 rounded-3xl p-7 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
            <Quote className="absolute -top-3 -right-3 w-24 h-24 rotate-180 text-accent/[0.06] dark:text-accent/10 pointer-events-none" />
            <div className="relative flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-slate-700'}`} />
                ))}
            </div>
            <p className="relative text-primary dark:text-gray-200 leading-relaxed text-[15px] flex-1 line-clamp-4">&ldquo;{t.comment}&rdquo;</p>
            <div className="relative flex items-center gap-3 pt-5 border-t border-primary/5 dark:border-white/8">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-700 p-[2px] flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-white dark:bg-ink-900 flex items-center justify-center overflow-hidden text-accent font-medium text-sm">
                        {t.avatar ? (
                            <Image src={t.avatar} alt={t.author} width={44} height={44} className="object-cover w-full h-full" />
                        ) : (
                            t.author.charAt(0).toUpperCase()
                        )}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-primary dark:text-white text-sm truncate flex items-center gap-1.5">
                        {t.author}
                        <BadgeCheck className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    </p>
                    <p className="text-xs text-gray-400 truncate">on {t.product}</p>
                </div>
            </div>
        </div>
    );
}

/** Compact, on-brand countdown for the Limited Offer section. */
function DealCountdown({ endDate }: { endDate: Date }) {
    const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const diff = endDate.getTime() - Date.now();
            if (diff <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setT({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff / 3600000) % 24),
                minutes: Math.floor((diff / 60000) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [endDate]);

    const units = [
        { v: t.days, l: 'Days' },
        { v: t.hours, l: 'Hrs' },
        { v: t.minutes, l: 'Min' },
        { v: t.seconds, l: 'Sec' },
    ];

    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-secondary dark:text-gray-400 font-medium tracking-widest uppercase mb-2.5">Offer ends in</span>
            <div className="flex gap-2.5">
                {units.map((u) => (
                    <div key={u.l} className="flex flex-col items-center">
                        <div className="w-12 h-14 rounded-xl bg-white dark:bg-ink-800 border border-primary/5 dark:border-white/10 shadow-sm flex items-center justify-center">
                            <span className="text-2xl font-medium text-accent tabular-nums">{String(u.v).padStart(2, '0')}</span>
                        </div>
                        <span className="text-[8px] font-medium text-gray-400 uppercase tracking-[0.15em] mt-1.5">{u.l}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const [activeTab, setActiveTab] = useState<'Hot' | 'New' | 'Sale'>('Hot');
    const { products, isLoading } = useProducts();
    const { banners } = useBanners();
    const { products: featured } = useFeaturedProducts();
    const { products: bestsellers, isLoading: bestLoading } = useBestsellers(8);
    const { products: newArrivals, isLoading: newLoading } = useNewArrivals(8);
    const { categories } = useCategories();
    const { stats } = usePublicStats();
    const { testimonials } = useTestimonials(8);
    const tMid = Math.ceil(testimonials.length / 2);
    const tRowA = testimonials.slice(0, tMid);
    const tRowB = testimonials.slice(tMid);

    const heroBanner = banners[0];
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    // Discounted products power the Sale tab, Flash Sale, and the Promo deal.
    const saleProducts = useMemo(
        () => products.filter((p) => (p.discount ?? 0) > 0).slice(0, 8),
        [products]
    );

    // Best Sellers tab content — now actually switches.
    const tabProducts = useMemo(() => {
        const pick =
            activeTab === 'Hot' ? (bestsellers.length ? bestsellers : featured)
                : activeTab === 'New' ? newArrivals
                    : saleProducts;
        return (pick.length ? pick : products).slice(0, 8);
    }, [activeTab, bestsellers, featured, newArrivals, saleProducts, products]);

    const tabLoading = activeTab === 'Hot' ? bestLoading : activeTab === 'New' ? newLoading : isLoading;

    // Stable countdown deadlines for this mount.
    const flashEnd = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 36), []);
    const promoEnd = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), []);

    const dealProduct = saleProducts[0];
    const dealOriginal = dealProduct ? dealProduct.price : 0;
    const dealNow = dealProduct ? dealProduct.price * (1 - (dealProduct.discount ?? 0) / 100) : 0;

    const subscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribing(true);
        try {
            await api.post('/newsletter', { email: newsletterEmail });
            toast.success('Subscribed! 🎉');
            setNewsletterEmail('');
        } catch {
            toast.error('Could not subscribe. Try again.');
        } finally {
            setSubscribing(false);
        }
    };

    // GSAP — hero load reveal + image parallax on scroll
    const heroSectionRef = useRef<HTMLElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const items = heroContentRef.current?.children;
            if (items && items.length) {
                gsap.set(items, { opacity: 0, y: 34 });
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    duration: 1.1,
                    ease: 'power3.out',
                    stagger: 0.12,
                    delay: 0.15,
                });
            }
            if (heroImageRef.current && heroSectionRef.current) {
                gsap.to(heroImageRef.current, {
                    yPercent: 14,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroSectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }
        });

        return () => ctx.revert();
    }, []);

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'Orders over $75' },
        { icon: Shield, title: 'Secure Payment', desc: 'Verified security' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '30 day returns' },
        { icon: Zap, title: 'Fast Delivery', desc: 'Across the globe' },
    ];

    const statItems = [
        { icon: Package, value: stats?.products ?? 0, suffix: '+', label: 'Products' },
        { icon: Users, value: stats?.customers ?? 0, suffix: '+', label: 'Happy Customers' },
        { icon: ShoppingBag, value: stats?.orders ?? 0, suffix: '+', label: 'Orders Delivered' },
        { icon: Star, value: stats?.avgRating ?? 5, decimals: 1, suffix: '★', label: 'Average Rating' },
    ];

    const websiteSchema = generateWebSiteSchema();
    const displayCategories = categories.slice(0, 6);

    return (
        <div className="bg-canvas dark:bg-ink-950 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

            {/* Hero Section */}
            <section ref={heroSectionRef} className="relative h-[86vh] min-h-[560px] max-h-[860px] bg-[#efece5] dark:bg-ink-900 overflow-hidden mx-3 md:mx-6 mt-3 md:mt-5 rounded-[1.5rem] md:rounded-[2rem]">
                <div ref={heroImageRef} className="absolute inset-x-0 top-[-8%] h-[116%] will-change-transform">
                    <Image
                        src={heroBanner?.image || '/home_accessories_hero.png'}
                        alt={heroBanner?.title || 'LuxeCart Collection'}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-start p-8 md:p-24">
                    <div ref={heroContentRef} className="max-w-2xl">
                        <span className="inline-flex items-center gap-3 text-white/90 font-sans font-medium tracking-[0.32em] text-[11px] md:text-xs mb-7 uppercase">
                            <span className="w-8 h-px bg-accent" />
                            {heroBanner?.subtitle || 'New Collection 2026'}
                        </span>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.02] mb-7 tracking-[-0.01em]">
                            {heroBanner?.title || <>Timeless pieces<br /><span className="italic font-normal">for modern living</span></>}
                        </h1>
                        <p className="text-base md:text-lg text-white/85 mb-10 max-w-md leading-relaxed font-sans font-light">
                            A curated collection of premium home accessories — designed with restraint, made to last.
                        </p>
                        <Link href={heroBanner?.ctaLink || '/products'} className="group inline-flex items-center gap-3 bg-white text-primary pl-8 pr-6 py-4 rounded-full font-sans font-medium text-sm tracking-[0.08em] hover:bg-accent hover:text-white transition-all duration-300 shadow-xl">
                            {heroBanner?.ctaText || 'Explore the Collection'}
                            <span className="grid place-items-center w-7 h-7 rounded-full bg-primary/10 group-hover:bg-white/20 transition-colors">
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="mt-12 mx-4 md:mx-8">
                <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-accent-900 via-accent-800 to-accent-950 px-6 py-14 md:py-20">
                    {/* Decorative glow orbs */}
                    <div className="absolute -top-28 -left-20 w-80 h-80 bg-accent/30 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" />
                    {/* Dot grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
                    />

                    <div className="relative max-w-7xl mx-auto">
                        <div className="text-center mb-12 md:mb-14 space-y-3">
                            <span className="inline-flex items-center gap-2 text-accent-300 font-medium tracking-[0.3em] text-[10px] md:text-xs uppercase">
                                <Sparkles className="w-3.5 h-3.5" /> Trusted Worldwide
                            </span>
                            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">The Numbers Speak</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                            {statItems.map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, ease: 'easeOut' }}
                                    viewport={{ once: true }}
                                    className="group relative rounded-3xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-6 md:p-8 text-center hover:bg-white/[0.07] hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <s.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <AnimatedCounter
                                        value={s.value}
                                        decimals={s.decimals ?? 0}
                                        suffix={s.suffix}
                                        className="block text-4xl md:text-6xl font-medium tracking-tight bg-gradient-to-b from-white to-accent-200 bg-clip-text text-transparent"
                                    />
                                    <p className="text-white/50 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase mt-3">{s.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Deals Carousel — rotating curated slides for visual variety */}
            <section className="mt-12 mx-4 md:mx-8">
                <HeroCarousel />
            </section>

            {/* Category Navigation (dynamic) */}
            {displayCategories.length > 0 && (
                <section className="py-12 md:py-20 overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto px-4 flex gap-8 md:gap-16 justify-start md:justify-center min-w-max">
                        {displayCategories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-4 group">
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-50 dark:border-white/8 shadow-sm group-hover:shadow-xl group-hover:border-accent transition-all duration-500 relative bg-ivory dark:bg-ink-800">
                                        <Image src={cat.image || FALLBACK_CAT_IMAGE} alt={cat.name} fill sizes="112px" className="object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-primary dark:text-white group-hover:text-accent transition-colors">{cat.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Features Strip */}
            <section className="py-8 border-y border-gray-100 dark:border-white/8 mb-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center gap-3 md:gap-4 group justify-center md:justify-start text-center md:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-ivory dark:bg-ink-800 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
                                <f.icon className="w-6 h-6 dark:text-gray-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs md:text-sm text-primary dark:text-white">{f.title}</h4>
                                <p className="text-[10px] md:text-xs text-secondary dark:text-gray-400">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Sellers (working tabs) */}
            <section className="py-12 md:py-24 bg-white dark:bg-ink-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <Reveal as="div" className="max-w-xl" stagger={0.12}>
                            <h2 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight mb-4">Our Best Sellers</h2>
                            <p className="text-secondary dark:text-gray-400 text-lg">Shop the most loved items this season.</p>
                        </Reveal>
                        <div className="flex gap-8 border-b border-gray-100 dark:border-white/8">
                            {(['Hot', 'New', 'Sale'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-medium tracking-widest uppercase transition-all relative ${activeTab === tab ? 'text-primary dark:text-white' : 'text-gray-400'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="activeTabHome" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary dark:bg-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {tabLoading ? (
                        <ProductGridSkeleton count={8} />
                    ) : tabProducts.length === 0 ? (
                        <p className="text-center text-secondary dark:text-gray-400 py-12">No products to show here yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                            {tabProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="mt-20 text-center">
                        <Link href="/products" className="inline-flex items-center gap-3 text-primary dark:text-white font-medium tracking-[0.2em] text-sm group uppercase">
                            Shop All Products
                            <div className="w-10 h-10 rounded-full border border-primary dark:border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Collections Showcase (dynamic categories) */}
            {displayCategories.length > 0 && (
                <section className="py-12 md:py-24">
                    <div className="max-w-7xl mx-auto px-4">
                        <Reveal as="div" className="text-center max-w-xl mx-auto mb-16 space-y-4" stagger={0.12}>
                            <span className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Curated For You</span>
                            <h2 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight">Shop by Collection</h2>
                        </Reveal>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {displayCategories.map((cat, i) => (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (i % 3) * 0.1 }}
                                    viewport={{ once: true }}
                                    className={i === 0 ? 'col-span-2 md:col-span-1 md:row-span-2' : ''}
                                >
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className={`relative block rounded-[2rem] overflow-hidden group ${i === 0 ? 'h-64 md:h-full md:min-h-[420px]' : 'h-64'}`}
                                    >
                                        <Image
                                            src={cat.image || FALLBACK_CAT_IMAGE}
                                            alt={cat.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                            <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-1">{cat.count} Products</p>
                                            <h3 className="text-white text-2xl md:text-3xl font-medium tracking-tight mb-3">{cat.name}</h3>
                                            <span className="inline-flex items-center gap-2 text-white text-xs font-medium tracking-widest uppercase group-hover:gap-3 transition-all">
                                                Shop Now <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Flash Sale (dynamic — only when there are deals) */}
            {saleProducts.length > 0 && (
                <FlashSaleSection products={saleProducts} endDate={flashEnd} onQuickView={() => { }} />
            )}

            {/* New Arrivals (dynamic) */}
            <section className="py-12 md:py-24 bg-ivory dark:bg-ink-900/40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <Reveal as="div" className="max-w-xl space-y-4" stagger={0.12}>
                            <span className="inline-flex items-center gap-2 text-accent font-medium tracking-[0.3em] text-xs uppercase">
                                <Sparkles className="w-4 h-4" /> Just Landed
                            </span>
                            <h2 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight">New Arrivals</h2>
                        </Reveal>
                        <Link href="/products?sort=newest" className="text-sm font-medium tracking-widest uppercase text-accent hover:underline">View All →</Link>
                    </div>

                    {newLoading ? (
                        <ProductGridSkeleton count={8} />
                    ) : newArrivals.length === 0 ? (
                        <p className="text-center text-secondary dark:text-gray-400 py-12">New arrivals are on the way.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                            {newArrivals.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Promo Section (dynamic deal + real countdown) */}
            <section className="py-16 md:py-24 bg-accent/5 mx-4 md:mx-8 rounded-[2rem] md:rounded-[3rem]">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <Link href={dealProduct ? `/products/${dealProduct.slug}` : '/products?filter=sale'} className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl group block">
                        <Image
                            src={dealProduct?.image || '/photo-1513506003901-1e6a229e2d15.webp'}
                            alt={dealProduct?.name || 'Featured deal'}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {dealProduct && (dealProduct.discount ?? 0) > 0 && (
                            <div className="absolute top-8 left-8">
                                <span className="bg-hot text-white px-4 py-2 rounded-xl text-sm font-medium tracking-widest uppercase shadow-lg">Save {dealProduct.discount}%</span>
                            </div>
                        )}
                    </Link>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-accent font-medium tracking-[0.4em] text-xs uppercase">Limited Offer</span>
                            <h2 className="text-4xl md:text-7xl font-medium text-primary dark:text-white tracking-tight leading-tight">
                                {dealProduct?.name || <>Minimalist <br />Design Deal</>}
                            </h2>
                        </div>
                        <p className="text-secondary dark:text-gray-400 text-xl leading-relaxed font-medium line-clamp-3">
                            {dealProduct?.description || 'Experience the perfect blend of form and function — exclusive mid-season pricing on our most-loved pieces.'}
                        </p>
                        <div className="flex flex-wrap gap-8 items-center">
                            {dealProduct ? (
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-sm font-bold line-through">${dealOriginal.toFixed(2)}</span>
                                    <span className="text-4xl md:text-5xl font-medium text-primary dark:text-white">${dealNow.toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-4xl md:text-5xl font-medium text-primary dark:text-white">Up to 50% Off</span>
                                </div>
                            )}
                            <div className="h-16 w-[1px] bg-gray-200 dark:bg-slate-700 hidden sm:block" />
                            <DealCountdown endDate={promoEnd} />
                        </div>
                        <Link href={dealProduct ? `/products/${dealProduct.slug}` : '/products?filter=sale'} className="inline-flex items-center gap-4 bg-primary dark:bg-accent text-white px-10 py-5 rounded-2xl font-medium text-sm tracking-[0.2em] hover:bg-black dark:hover:bg-accent-600 hover:scale-105 active:scale-95 transition-all shadow-xl uppercase">
                            Shop The Deal <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials (dynamic — only when reviews exist) */}
            {testimonials.length > 0 && (
                <section className="py-16 md:py-28 bg-ivory dark:bg-ink-900/40">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
                            <div className="space-y-4 max-w-xl">
                                <span className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Loved by Customers</span>
                                <h2 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight">What People Say</h2>
                            </div>
                            {stats && stats.reviewCount > 0 && (
                                <div className="flex items-center gap-4 bg-white dark:bg-ink-900 border border-primary/5 dark:border-white/8 rounded-2xl px-6 py-4 shadow-sm self-start lg:self-auto">
                                    <span className="text-5xl font-medium text-primary dark:text-white tracking-tight leading-none">{stats.avgRating.toFixed(1)}</span>
                                    <div className="space-y-1.5">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, s) => (
                                                <Star key={s} className={`w-4 h-4 ${s < Math.round(stats.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-slate-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-secondary dark:text-gray-400 font-medium">Based on {stats.reviewCount} review{stats.reviewCount === 1 ? '' : 's'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-5">
                            {/* row 1 — scrolls left */}
                            <div className="marquee-row overflow-hidden">
                                <div className="flex w-max animate-marquee-left">
                                    {[...tRowA, ...tRowA].map((t, i) => <TestimonialCard key={`a-${i}`} t={t} />)}
                                </div>
                            </div>
                            {/* row 2 — scrolls right */}
                            {tRowB.length > 0 && (
                                <div className="marquee-row overflow-hidden">
                                    <div className="flex w-max animate-marquee-right">
                                        {[...tRowB, ...tRowB].map((t, i) => <TestimonialCard key={`b-${i}`} t={t} />)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Recently Viewed — only renders if user has browsed products */}
            <RecentlyViewedSection />

            {/* Newsletter */}
            <section className="py-24 md:py-40">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
                    <Reveal as="div" className="space-y-4" stagger={0.12}>
                        <h2 className="text-4xl md:text-7xl font-medium text-primary dark:text-white tracking-tight">Stay Inspired</h2>
                        <p className="text-secondary dark:text-gray-400 text-lg px-8">Join our community and get exclusive early access to our new drops, styling tips, and 15% off your first order.</p>
                    </Reveal>
                    <form onSubmit={subscribe} className="max-w-md mx-auto relative group">
                        <input
                            type="email"
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-ivory dark:bg-ink-900 border-2 border-gray-100 dark:border-white/8 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-accent transition-all pl-8 pr-32 dark:text-white"
                        />
                        <button type="submit" disabled={subscribing} className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-xl text-xs font-medium tracking-widest hover:bg-accent transition-all uppercase disabled:opacity-60">
                            {subscribing ? '...' : 'Join'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

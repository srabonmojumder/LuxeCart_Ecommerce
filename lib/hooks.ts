'use client';

/**
 * STATIC data adapter.
 *
 * This branch ships the storefront design with NO backend. Every hook below
 * keeps the exact same name + return shape the pages expect, but serves data
 * synchronously from the static `data/products.ts` catalog (storefront) or
 * returns empty/safe defaults (the dynamic-only auth/orders/admin areas, which
 * are design-only shells here). The dynamic versions live on the `backend` branch.
 */

import { products } from '@/data/products';
import type { Product } from '@/store/useStore';

// No-op mutate so pages that call mutate() after an action still compile/run.
const noop = async () => undefined;
const FIXED_DATE = '2026-01-01T00:00:00.000Z';

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    gradient: string | null;
    count: number;
}

// Derive the category list from the static catalog.
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const categoryNames = Array.from(new Set(products.map((p) => p.category)));
const staticCategories: Category[] = categoryNames.map((name, i) => ({
    id: i + 1,
    name,
    slug: slugify(name),
    image: products.find((p) => p.category === name)?.image ?? null,
    description: null,
    gradient: null,
    count: products.filter((p) => p.category === name).length,
}));

/** Find a product by its slug or numeric id (links use `slug ?? id`). */
const findProduct = (key: string) =>
    products.find((p) => p.slug === key || String(p.id) === key);

/** All products. */
export function useProducts() {
    return { products, isLoading: false, error: undefined };
}

/** A single product by slug (or id). */
export function useProduct(slug: string | undefined) {
    const product = slug ? findProduct(slug) : undefined;
    return { product, isLoading: false, error: undefined };
}

/** Related products — same category, excluding the current one. */
export function useRelatedProducts(slug: string | undefined) {
    const current = slug ? findProduct(slug) : undefined;
    const related = current
        ? products.filter((p) => p.category === current.category && p.id !== current.id).slice(0, 4)
        : [];
    return { related, isLoading: false };
}

/** Newest products — highest ids first. */
export function useNewArrivals(limit = 8) {
    const list = [...products].sort((a, b) => b.id - a.id).slice(0, limit);
    return { products: list, isLoading: false };
}

export interface PublicStats {
    products: number;
    customers: number;
    orders: number;
    avgRating: number;
    reviewCount: number;
}

export function usePublicStats() {
    const avg = products.reduce((s, p) => s + p.rating, 0) / (products.length || 1);
    const stats: PublicStats = {
        products: products.length,
        customers: 12500,
        orders: 48200,
        avgRating: Number(avg.toFixed(1)),
        reviewCount: products.reduce((s, p) => s + p.reviews, 0),
    };
    return { stats, isLoading: false };
}

export interface Testimonial {
    id: number;
    rating: number;
    comment: string;
    author: string;
    avatar: string | null;
    product: string;
    productSlug: string;
    productImage: string;
    createdAt: string;
}

const TESTIMONIAL_AUTHORS = ['Sarah K.', 'James L.', 'Aisha R.', 'Michael T.', 'Nadia H.', 'David P.', 'Emma W.', 'Omar S.'];
const TESTIMONIAL_COMMENTS = [
    'Absolutely love it — great quality and fast delivery!',
    'Exactly as described. Will definitely shop here again.',
    'Premium feel for the price. Highly recommend.',
    'Smooth checkout and the product exceeded my expectations.',
    'Fantastic customer service and a beautiful product.',
    'Best purchase I’ve made this year. Five stars!',
    'Arrived quickly and well packaged. Very happy.',
    'Top-notch quality. Couldn’t be happier.',
];

export function useTestimonials(limit = 8) {
    const top = [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
    const testimonials: Testimonial[] = top.map((p, i) => ({
        id: i + 1,
        rating: Math.round(p.rating),
        comment: TESTIMONIAL_COMMENTS[i % TESTIMONIAL_COMMENTS.length],
        author: TESTIMONIAL_AUTHORS[i % TESTIMONIAL_AUTHORS.length],
        avatar: null,
        product: p.name,
        productSlug: p.slug ?? String(p.id),
        productImage: p.image,
        createdAt: FIXED_DATE,
    }));
    return { testimonials, isLoading: false };
}

export interface PaymentMethods {
    cod: boolean;
    card: boolean;
    stripeLive: boolean;
    sslcommerz: boolean;
}

export function usePaymentMethods() {
    return { cod: true, card: true, stripeLive: false, sslcommerz: false };
}

// ----------------------------- Blog -----------------------------

export interface BlogPostSummary {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    image: string;
    author: string;
    tags: string[];
    publishedAt: string;
}

export interface BlogPost extends BlogPostSummary {
    content: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BlogListPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface BlogMeta {
    recent: { id: number; slug: string; title: string; image: string; publishedAt: string }[];
    archive: { month: string; year: number; posts: { slug: string; title: string }[] }[];
    tags: { name: string; count: number }[];
}

// Blog is a dynamic feature on the backend — empty here.
export function usePosts(_params: { page?: number; limit?: number; q?: string; tag?: string } = {}) {
    const pagination: BlogListPagination = { page: 1, limit: 9, total: 0, totalPages: 0 };
    return { posts: [] as BlogPostSummary[], pagination, isLoading: false };
}

export function useBlogMeta() {
    const meta: BlogMeta = { recent: [], archive: [], tags: [] };
    return { meta, isLoading: false };
}

export function usePost(_slug: string | undefined) {
    return { post: undefined as BlogPost | undefined, isLoading: false, error: undefined };
}

export function useAdminPosts(_enabled: boolean) {
    return { posts: [] as BlogPost[], isLoading: false, mutate: noop };
}

export function useCategories() {
    return { categories: staticCategories, isLoading: false, error: undefined, mutate: noop };
}

export function useCategory(slug: string | null | undefined) {
    const category = slug ? staticCategories.find((c) => c.slug === slug || c.name === slug) : undefined;
    return { category, isLoading: false };
}

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    author: string;
    createdAt: string;
}

export function useProductReviews(_slug: string | undefined) {
    return { reviews: [] as Review[], isLoading: false, mutate: noop };
}

export interface OrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    slug: string | null;
}

export interface OrderEvent {
    status: string;
    note: string | null;
    createdAt: string;
}

export interface OrderReturn {
    id: number;
    status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'RECEIVED' | 'REFUNDED';
    reason: string;
    adminNote: string | null;
    createdAt: string;
}

export interface Order {
    id: number;
    status: string;
    subtotal: number;
    discount: number;
    couponCode: string | null;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: Record<string, unknown>;
    trackingNumber: string | null;
    carrier: string | null;
    cancelReason: string | null;
    canCancel: boolean;
    returns: OrderReturn[];
    createdAt: string;
    payment: { status: string; provider: string } | null;
    events: OrderEvent[];
    items: OrderItem[];
}

export function useOrders(_enabled: boolean) {
    return { orders: [] as Order[], isLoading: false, mutate: noop };
}

export function useOrder(_id: string | number | null | undefined) {
    return { order: undefined as Order | undefined, isLoading: false, error: undefined, mutate: noop };
}

export interface Address {
    id: number;
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state?: string | null;
    postalCode: string;
    country: string;
    phone?: string | null;
    isDefault: boolean;
}

export function useAddresses(_enabled: boolean) {
    return { addresses: [] as Address[], isLoading: false, mutate: noop };
}

// ---------------- Admin (design-only shells on this static branch) ----------------

export interface AdminProduct {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    discount: number;
    image: string;
    stock: number;
    inStock: boolean;
    isActive: boolean;
    featured: boolean;
    category?: { id: number; name: string } | null;
    tags?: { tag: { name: string } }[];
}

export function useAdminProducts(_enabled: boolean) {
    return { products: [] as AdminProduct[], isLoading: false, mutate: noop };
}

export interface AdminOrder {
    id: number;
    status: string;
    total: string | number;
    createdAt: string;
    trackingNumber?: string | null;
    carrier?: string | null;
    user?: { email: string; displayName: string | null } | null;
    items?: { id: number; name: string; quantity: number }[];
}

export function useAdminOrders(_enabled: boolean) {
    return { orders: [] as AdminOrder[], isLoading: false, mutate: noop };
}

export interface AdminStats {
    products: number;
    activeProducts: number;
    categories: number;
    users: number;
    orders: number;
    pendingOrders: number;
    revenue: number;
    recentOrders: { id: number; total: number; status: string; createdAt: string; customer: string }[];
    lowStock: { id: number; name: string; slug: string; stock: number }[];
}

export function useAdminStats(_enabled: boolean) {
    return { stats: undefined as AdminStats | undefined, isLoading: false, mutate: noop };
}

export interface AdminUser {
    id: number;
    email: string;
    displayName: string | null;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: string;
    _count: { orders: number };
}

export function useAdminUsers(_enabled: boolean) {
    return { users: [] as AdminUser[], isLoading: false, mutate: noop };
}

export interface AdminReview {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    product: string;
    productSlug: string | null;
    author: string;
}

export function useAdminReviews(_enabled: boolean) {
    return { reviews: [] as AdminReview[], isLoading: false, mutate: noop };
}

// ---------------- Store config / marketing ----------------

export interface Settings {
    storeName: string;
    supportEmail: string;
    supportPhone: string;
    address: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    announcement: string | null;
    freeShippingThreshold: number;
    shippingFlat: number;
    taxRate: number;
    currencyCode: string;
    currencySymbol: string;
}

const STATIC_SETTINGS: Settings = {
    storeName: 'LuxeCart',
    supportEmail: 'support@luxecart.com',
    supportPhone: '01827621312',
    address: null,
    facebook: null,
    instagram: null,
    twitter: null,
    announcement: null,
    freeShippingThreshold: 100,
    shippingFlat: 5,
    taxRate: 0,
    currencyCode: 'USD',
    currencySymbol: '$',
};

export function useSettings() {
    return { settings: STATIC_SETTINGS, isLoading: false, mutate: noop };
}

export interface Banner {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    ctaText: string | null;
    ctaLink: string | null;
    active: boolean;
    position: number;
}

export function useBanners() {
    return { banners: [] as Banner[], isLoading: false };
}

export function useFeaturedProducts() {
    const featured = products.filter((p) => p.discount && p.discount > 0).slice(0, 12);
    return { products: featured.length ? featured : products.slice(0, 12), isLoading: false };
}

export function useBestsellers(limit = 8) {
    const list = [...products]
        .sort((a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1))
        .slice(0, limit);
    return { products: list, isLoading: false };
}

export interface AdminCoupon {
    id: number;
    code: string;
    type: 'PERCENT' | 'FIXED';
    value: number;
    minSubtotal: number;
    active: boolean;
    expiresAt: string | null;
    maxUses: number | null;
    usedCount: number;
}

export function useAdminCoupons(_enabled: boolean) {
    return { coupons: [] as AdminCoupon[], isLoading: false, mutate: noop };
}

export function useAdminBanners(_enabled: boolean) {
    return { banners: [] as Banner[], isLoading: false, mutate: noop };
}

export interface Subscriber {
    id: number;
    email: string;
    createdAt: string;
}

export function useSubscribers(_enabled: boolean) {
    return { subscribers: [] as Subscriber[], isLoading: false, mutate: noop };
}

export interface AdminAnalytics {
    days: number;
    series: { date: string; revenue: number; orders: number }[];
    topProducts: { name: string; qty: number; revenue: number }[];
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    statusBreakdown: { status: string; count: number }[];
}

export function useAdminAnalytics(_enabled: boolean, _days = 30) {
    return { analytics: undefined as AdminAnalytics | undefined, isLoading: false, mutate: noop };
}

export interface AdminDashboard {
    availableProducts: number;
    pendingOrders: number;
    numberOfSales: number;
    totalSales: number;
    salesGoal: number;
    salesGoalPct: number;
    growthRatePct: number;
    customerVolumeChangePct: number;
    totalCustomers: number;
    monthly: { ym: string; month: string; revenue: number }[];
    heatmap: { day: number; hour: number; count: number }[];
    heatmapMax: number;
    reviews: { avg: number; total: number; distribution: { stars: number; count: number }[] };
    recentOrders: { id: number; customer: string; country: string; total: number; status: string; createdAt: string }[];
}

export function useAdminDashboard(_enabled: boolean) {
    return { dashboard: undefined as AdminDashboard | undefined, isLoading: false, mutate: noop };
}

export interface AdminReturn {
    id: number;
    status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'RECEIVED' | 'REFUNDED';
    reason: string;
    adminNote: string | null;
    createdAt: string;
    orderId: number;
    orderTotal: number;
    orderStatus: string | null;
    customer: string;
}

export function useAdminReturns(_enabled: boolean) {
    return { returns: [] as AdminReturn[], isLoading: false, mutate: noop };
}

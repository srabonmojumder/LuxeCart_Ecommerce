'use client';

import useSWR from 'swr';
import { api } from './api';
import type { Product } from '@/store/useStore';

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    gradient: string | null;
    count: number;
}

const fetcher = <T,>(path: string) => api.get<T>(path);
const authFetcher = <T,>(path: string) => api.get<T>(path, true);

/** All products (the catalog is small, so we fetch once and filter client-side). */
export function useProducts() {
    const { data, error, isLoading } = useSWR<{ data: Product[] }>(
        '/products?limit=200',
        fetcher
    );
    return { products: data?.data ?? [], isLoading, error };
}

/** A single product by slug. */
export function useProduct(slug: string | undefined) {
    const { data, error, isLoading } = useSWR<{ data: Product }>(
        slug ? `/products/${slug}` : null,
        fetcher
    );
    return { product: data?.data, isLoading, error };
}

/** Related products for a given slug. */
export function useRelatedProducts(slug: string | undefined) {
    const { data, isLoading } = useSWR<{ data: Product[] }>(
        slug ? `/products/${slug}/related` : null,
        fetcher
    );
    return { related: data?.data ?? [], isLoading };
}

export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR<{ data: Category[] }>('/categories', fetcher);
    return { categories: data?.data ?? [], isLoading, error, mutate };
}

/** A single category by slug (for category banners / headers). */
export function useCategory(slug: string | null | undefined) {
    const { data, isLoading } = useSWR<{ data: Category }>(slug ? `/categories/${slug}` : null, fetcher);
    return { category: data?.data, isLoading };
}

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    author: string;
    createdAt: string;
}

export function useProductReviews(slug: string | undefined) {
    const { data, isLoading, mutate } = useSWR<{ data: Review[] }>(
        slug ? `/products/${slug}/reviews` : null,
        fetcher
    );
    return { reviews: data?.data ?? [], isLoading, mutate };
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

/** The logged-in user's orders. Pass enabled=false to skip fetching for guests. */
export function useOrders(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: Order[] }>(
        enabled ? '/orders' : null,
        authFetcher
    );
    return { orders: data?.data ?? [], isLoading, mutate };
}

/** A single order by id (requires auth). */
export function useOrder(id: string | number | null | undefined) {
    const { data, isLoading, error, mutate } = useSWR<{ data: Order }>(
        id ? `/orders/${id}` : null,
        authFetcher
    );
    return { order: data?.data, isLoading, error, mutate };
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

export function useAddresses(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: Address[] }>(
        enabled ? '/account/addresses' : null,
        authFetcher
    );
    return { addresses: data?.data ?? [], isLoading, mutate };
}

// ---------------- Admin ----------------

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

export function useAdminProducts(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminProduct[] }>(
        enabled ? '/admin/products' : null,
        authFetcher
    );
    return { products: data?.data ?? [], isLoading, mutate };
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

export function useAdminOrders(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminOrder[] }>(
        enabled ? '/admin/orders' : null,
        authFetcher
    );
    return { orders: data?.data ?? [], isLoading, mutate };
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

export function useAdminStats(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminStats }>(
        enabled ? '/admin/stats' : null,
        authFetcher
    );
    return { stats: data?.data, isLoading, mutate };
}

export interface AdminUser {
    id: number;
    email: string;
    displayName: string | null;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: string;
    _count: { orders: number };
}

export function useAdminUsers(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminUser[] }>(
        enabled ? '/admin/users' : null,
        authFetcher
    );
    return { users: data?.data ?? [], isLoading, mutate };
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

export function useAdminReviews(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminReview[] }>(
        enabled ? '/admin/reviews' : null,
        authFetcher
    );
    return { reviews: data?.data ?? [], isLoading, mutate };
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

export function useSettings() {
    const { data, isLoading, mutate } = useSWR<{ data: Settings }>('/settings', fetcher);
    return { settings: data?.data, isLoading, mutate };
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
    const { data, isLoading } = useSWR<{ data: Banner[] }>('/banners', fetcher);
    return { banners: data?.data ?? [], isLoading };
}

export function useFeaturedProducts() {
    const { data, isLoading } = useSWR<{ data: Product[] }>('/products?featured=true&limit=12', fetcher);
    return { products: data?.data ?? [], isLoading };
}

/** Best-selling products (by units sold, backfilled with popular ones). */
export function useBestsellers(limit = 8) {
    const { data, isLoading } = useSWR<{ data: Product[] }>(`/products/bestsellers?limit=${limit}`, fetcher);
    return { products: data?.data ?? [], isLoading };
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

export function useAdminCoupons(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminCoupon[] }>(
        enabled ? '/admin/coupons' : null,
        authFetcher
    );
    return { coupons: data?.data ?? [], isLoading, mutate };
}

export function useAdminBanners(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: Banner[] }>(
        enabled ? '/admin/banners' : null,
        authFetcher
    );
    return { banners: data?.data ?? [], isLoading, mutate };
}

export interface Subscriber {
    id: number;
    email: string;
    createdAt: string;
}

export function useSubscribers(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: Subscriber[] }>(
        enabled ? '/admin/newsletter' : null,
        authFetcher
    );
    return { subscribers: data?.data ?? [], isLoading, mutate };
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

export function useAdminAnalytics(enabled: boolean, days = 30) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminAnalytics }>(
        enabled ? `/admin/analytics?days=${days}` : null,
        authFetcher
    );
    return { analytics: data?.data, isLoading, mutate };
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

export function useAdminReturns(enabled: boolean) {
    const { data, isLoading, mutate } = useSWR<{ data: AdminReturn[] }>(
        enabled ? '/admin/returns' : null,
        authFetcher
    );
    return { returns: data?.data ?? [], isLoading, mutate };
}

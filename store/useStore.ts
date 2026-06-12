import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { getAccessToken } from '@/lib/authToken';

export interface Product {
    id: number;
    name: string;
    slug?: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    discount?: number;
    stock?: number;
    colors?: string[];
    sizes?: string[];
    tags?: string[];
}

export interface CartItem extends Product {
    quantity: number;
}

const isAuthed = () => typeof window !== 'undefined' && !!getAccessToken();

interface StoreState {
    cart: CartItem[];
    wishlist: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    // Server sync
    hydrateFromServer: () => Promise<void>;
    syncGuestStateToServer: () => Promise<void>;
    resetLocalState: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],

            addToCart: (product) => {
                const cart = get().cart;
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        cart: cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                }

                if (isAuthed()) {
                    api.post('/cart', { productId: product.id, quantity: 1 }, true)
                        .catch(() => get().hydrateFromServer());
                }
            },

            removeFromCart: (id) => {
                set({ cart: get().cart.filter(item => item.id !== id) });
                if (isAuthed()) {
                    api.del(`/cart/${id}`, true).catch(() => get().hydrateFromServer());
                }
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(id);
                    return;
                }

                set({
                    cart: get().cart.map(item =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
                if (isAuthed()) {
                    api.patch(`/cart/${id}`, { quantity }, true).catch(() => get().hydrateFromServer());
                }
            },

            clearCart: () => {
                set({ cart: [] });
                if (isAuthed()) {
                    api.del('/cart', true).catch(() => get().hydrateFromServer());
                }
            },

            addToWishlist: (product) => {
                const wishlist = get().wishlist;
                if (!wishlist.find(item => item.id === product.id)) {
                    set({ wishlist: [...wishlist, product] });
                }
                if (isAuthed()) {
                    api.post('/wishlist', { productId: product.id }, true)
                        .catch(() => get().hydrateFromServer());
                }
            },

            removeFromWishlist: (id) => {
                set({ wishlist: get().wishlist.filter(item => item.id !== id) });
                if (isAuthed()) {
                    api.del(`/wishlist/${id}`, true).catch(() => get().hydrateFromServer());
                }
            },

            isInWishlist: (id) => {
                return get().wishlist.some(item => item.id === id);
            },

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => {
                    const price = item.discount
                        ? item.price * (1 - item.discount / 100)
                        : item.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getTotalItems: () => {
                return get().cart.reduce((total, item) => total + item.quantity, 0);
            },

            // Pull the authoritative cart & wishlist from the server.
            hydrateFromServer: async () => {
                try {
                    const [cart, wl] = await Promise.all([
                        api.get<{ items: CartItem[] }>('/cart', true),
                        api.get<{ items: Product[] }>('/wishlist', true),
                    ]);
                    set({ cart: cart.items, wishlist: wl.items });
                } catch {
                    /* not authenticated yet — keep local state */
                }
            },

            // On login: push the guest cart/wishlist to the server, then hydrate.
            syncGuestStateToServer: async () => {
                const { cart, wishlist } = get();
                try {
                    if (cart.length) {
                        await api.post('/cart/merge', {
                            items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
                        }, true);
                    }
                    for (const w of wishlist) {
                        await api.post('/wishlist', { productId: w.id }, true).catch(() => {});
                    }
                } finally {
                    await get().hydrateFromServer();
                }
            },

            resetLocalState: () => set({ cart: [], wishlist: [] }),
        }),
        {
            name: 'luxecart-storage',
        }
    )
);

import { redirect } from 'next/navigation';

/**
 * /shop is the customer-facing shop entry point. The full shop UI lives on
 * /products (filters, search, sort, grid), so this route just forwards.
 */
export default function ShopPage() {
    redirect('/products');
}

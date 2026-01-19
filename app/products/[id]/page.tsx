import ProductDetailClient from './ProductDetailClient';
import { products } from '@/data/products';

export function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default function ProductDetailPage() {
    return <ProductDetailClient />;
}

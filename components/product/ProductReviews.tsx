'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Verified } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Review {
    id: number;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
    verified: boolean;
}

const mockReviews: Review[] = [
    {
        id: 1,
        author: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        rating: 5,
        date: '2 days ago',
        comment: 'Absolutely love this product! The quality is outstanding and it exceeded my expectations. Highly recommend!',
        helpful: 24,
        verified: true,
    },
    {
        id: 2,
        author: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        rating: 4,
        date: '1 week ago',
        comment: 'Great product overall. Delivery was fast and packaging was excellent. Only minor issue was the color was slightly different than shown.',
        helpful: 15,
        verified: true,
    },
    {
        id: 3,
        author: 'Michael Brown',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Best purchase I\'ve made this year! The build quality is premium and it works perfectly. Will buy again!',
        helpful: 32,
        verified: true,
    },
];

interface ProductReviewsProps {
    productId: number;
    averageRating: number;
    totalReviews: number;
}

export default function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
    const [helpfulClicks, setHelpfulClicks] = useState<{ [key: number]: boolean }>({});

    const handleHelpful = (reviewId: number) => {
        setHelpfulClicks({ ...helpfulClicks, [reviewId]: !helpfulClicks[reviewId] });
    };

    const ratingDistribution = [
        { stars: 5, count: 145, percentage: 75 },
        { stars: 4, count: 32, percentage: 16 },
        { stars: 3, count: 12, percentage: 6 },
        { stars: 2, count: 4, percentage: 2 },
        { stars: 1, count: 2, percentage: 1 },
    ];

    return (
        <div className="space-y-8">
            {/* Rating Overview */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div>
                            <div className="text-6xl font-bold text-gray-900 dark:text-white">
                                {averageRating}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-6 h-6 ${i < Math.floor(averageRating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Based on {totalReviews} reviews
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                        <div key={item.stars} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.stars}
                                </span>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${item.percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: item.stars * 0.1 }}
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                                />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                                {item.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Button */}
            <div className="flex justify-center">
                <button className="btn-primary flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Write a Review
                </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Customer Reviews
                </h3>

                {mockReviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="card border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={review.avatar}
                                    alt={review.author}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {review.author}
                                    </h4>
                                    {review.verified && (
                                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                            <Verified className="w-3 h-3 text-green-600 dark:text-green-400" />
                                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                Verified
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {review.date}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-3">
                                    {review.comment}
                                </p>

                                <button
                                    onClick={() => handleHelpful(review.id)}
                                    className={`flex items-center gap-2 text-sm transition-colors ${helpfulClicks[review.id]
                                            ? 'text-purple-600'
                                            : 'text-gray-500 hover:text-purple-600'
                                        }`}
                                >
                                    <ThumbsUp
                                        className={`w-4 h-4 ${helpfulClicks[review.id] ? 'fill-current' : ''}`}
                                    />
                                    Helpful ({review.helpful + (helpfulClicks[review.id] ? 1 : 0)})
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
                <button className="btn-outline">Load More Reviews</button>
            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Users, TrendingUp, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            About LuxeCart
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Your trusted partner for premium online shopping experiences since 2020
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Our Story
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                Founded in 2020, LuxeCart began with a simple mission: to make premium products accessible to everyone through an exceptional online shopping experience.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                What started as a small team of passionate entrepreneurs has grown into a thriving e-commerce platform serving thousands of satisfied customers worldwide.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                We believe in quality, authenticity, and customer satisfaction. Every product in our catalog is carefully curated to meet our high standards.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/photo-1556742049-0cfed4f6a45d.webp"
                                alt="Our Team"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
                    >
                        Our Core Values
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Award,
                                title: 'Quality First',
                                description: 'We never compromise on product quality and authenticity',
                            },
                            {
                                icon: Users,
                                title: 'Customer Focus',
                                description: 'Your satisfaction is our top priority',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Innovation',
                                description: 'Constantly improving our platform and services',
                            },
                            {
                                icon: Zap,
                                title: 'Fast Delivery',
                                description: 'Quick and reliable shipping to your doorstep',
                            },
                        ].map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="card text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {[
                            { label: 'Products', value: '10,000+' },
                            { label: 'Happy Customers', value: '50,000+' },
                            { label: 'Countries', value: '25+' },
                            { label: 'Team Members', value: '100+' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-lg text-white/90">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
                    >
                        Meet Our Team
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah Johnson',
                                role: 'CEO & Founder',
                                image: '/photo-1494790108377-be9c29b29330.webp',
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Head of Operations',
                                image: '/photo-1507003211169-0a1dd7228f2d.webp',
                            },
                            {
                                name: 'Emily Davis',
                                role: 'Customer Success Lead',
                                image: '/photo-1438761681033-6461ffad8d80.webp',
                            },
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card text-center group"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

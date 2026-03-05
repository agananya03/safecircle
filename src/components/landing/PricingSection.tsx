"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const includedFeatures = [
    "Unlimited circles",
    "Unlimited alerts",
    "Live location sharing",
    "Journey tracking",
    "Check-in system",
    "Fake call feature",
    "Voice activation",
    "24/7 support",
    "All future features"
];

export function PricingSection() {
    return (
        <section id="pricing" className="bg-[#f9fafb] py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
                    >
                        Free Forever. Seriously.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Safety shouldn't have a price tag. All features, unlimited circles, zero cost.
                    </motion.p>
                </div>

                <div className="flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full max-w-lg bg-white rounded-3xl p-1 relative overflow-hidden shadow-2xl"
                    >
                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 opacity-20" />

                        <div className="relative bg-white rounded-[22px] p-8 sm:p-12 h-full flex flex-col items-center">
                            <h3 className="text-2xl font-bold tracking-widest text-gray-400 uppercase mb-4">
                                Free Forever
                            </h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black text-gray-900">$0</span>
                                <span className="text-xl text-gray-500 font-medium">/mo</span>
                            </div>

                            <ul className="w-full space-y-4 mb-10 text-left">
                                {includedFeatures.map((feature, featureIdx) => (
                                    <li key={featureIdx} className="flex flex-start gap-4 text-gray-700 font-medium">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-pink-600" strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register"
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full font-bold text-lg hover:from-pink-600 hover:to-violet-600 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
                            >
                                Get Started Free &rarr;
                            </Link>

                            <p className="text-sm text-gray-400 mt-6 text-center italic">
                                Made possible through community support and grants
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

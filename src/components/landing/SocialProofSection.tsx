"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        quote: "SafeCircle completely changed how I feel walking home after late shifts. The fake call feature is brilliant.",
        name: "Sarah Jenkins",
        location: "London, UK",
        initials: "SJ",
        color: "bg-pink-100 text-pink-700"
    },
    {
        quote: "My entire family uses the Check-In system now. It's so much easier than texting 'I'm home safe' every night.",
        name: "Elena Rodriguez",
        location: "Austin, TX",
        initials: "ER",
        color: "bg-violet-100 text-violet-700"
    },
    {
        quote: "The voice activation is a game changer. I don't even need to touch my phone to send an alert to my circle.",
        name: "Maya Patel",
        location: "Toronto, CA",
        initials: "MP",
        color: "bg-blue-100 text-blue-700"
    }
];

export function SocialProofSection() {
    return (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-50">
            <div className="max-w-7xl mx-auto text-center">

                {/* Stats Counter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-2"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-violet-500">
                            50,000+
                        </h2>
                        <p className="text-gray-500 font-medium">Women Protected</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2 border-y md:border-y-0 md:border-x border-gray-100 py-8 md:py-0"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-violet-500">
                            1M+
                        </h2>
                        <p className="text-gray-500 font-medium">Alerts Sent Status</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-violet-500">
                            500+
                        </h2>
                        <p className="text-gray-500 font-medium">Lives Safely Secured</p>
                    </motion.div>
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-50"
                        >
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${t.color}`}>
                                    {t.initials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                                    <p className="text-sm text-gray-500">{t.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

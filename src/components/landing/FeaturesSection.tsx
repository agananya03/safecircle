"use client";

import { motion } from "framer-motion";
import { AlertCircle, Users, MapPin, Route, Clock, PhoneIncoming } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: <AlertCircle className="w-8 h-8 text-white" />,
        title: "One-Tap SOS Alert",
        description: "Send instant silent alerts to your trusted circles with your exact location. Help arrives faster when every second counts.",
        link: "#",
        gradient: "from-pink-500 to-rose-500"
    },
    {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Your Safety Circles",
        description: "Create groups with friends, family, and neighbors. Share your safety status only with people you trust completely.",
        link: "#",
        gradient: "from-violet-500 to-purple-500"
    },
    {
        icon: <MapPin className="w-8 h-8 text-white" />,
        title: "Live Location Sharing",
        description: "Share your real-time location during emergencies. Your circle can see exactly where you are on the map.",
        link: "#",
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        icon: <Route className="w-8 h-8 text-white" />,
        title: "Journey Tracking",
        description: "Track your late-night commutes. Auto-alert your circle if you don't reach your destination on time.",
        link: "#",
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        icon: <Clock className="w-8 h-8 text-white" />,
        title: "Smart Check-Ins",
        description: "Set safety check-ins. If you don't confirm by the deadline, automatic alerts notify your circle.",
        link: "#",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        icon: <PhoneIncoming className="w-8 h-8 text-white" />,
        title: "Fake Call Escape",
        description: "Generate realistic incoming calls to gracefully exit uncomfortable situations. Your secret escape plan.",
        link: "#",
        gradient: "from-fuchsia-500 to-pink-500"
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="bg-[#f9fafb] py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
                    >
                        Everything You Need to Stay Safe
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600"
                    >
                        Powerful features designed for real-world safety
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[24px] p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(236,72,153,0.15)] border border-transparent hover:border-pink-100 transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6 h-[84px]">{feature.description}</p>
                            <Link href={feature.link} className="text-pink-500 font-semibold group-hover:text-pink-600 flex items-center gap-1">
                                Learn more <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

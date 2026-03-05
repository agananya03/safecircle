"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map as MapIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/dashboard",
            label: "Home",
            icon: Home
        },
        {
            href: "/map",
            label: "Map",
            icon: MapIcon
        },
        {
            href: "/profile",
            label: "Profile",
            icon: User
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-around border-t bg-background/95 pb-safe pt-1 backdrop-blur lg:hidden">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex h-full w-full flex-col items-center justify-center space-y-1 text-muted-foreground transition-colors active:bg-muted/50",
                            isActive && "text-primary"
                        )}
                    >
                        <Icon className={cn("h-6 w-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const settingsNav = [
    {
        title: "Profile",
        href: "/profile",
    },
    {
        title: "Account",
        href: "/account",
    },
    {
        title: "Appearance",
        href: "/appearance",
    },
    {
        title: "Notifications",
        href: "/notifications",
    },
    {
        title: "Map",
        href: "/map",
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    className?: string
}

export function Sidebar({ className, ...props }: SidebarProps) {
    return (
        <nav
            className={`flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 ${className}`}
            {...props}
        >
            {settingsNav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                >
                    <Button variant="ghost" className="w-full justify-start">
                        {item.title}
                    </Button>
                </Link>
            ))}
        </nav>
    )
}

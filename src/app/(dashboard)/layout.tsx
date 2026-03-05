import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden w-64 border-r bg-muted/40 lg:block">
                    <Sidebar className="h-full py-4 pl-4" />
                </aside>
                {/* Pad bottom on mobile so content isn't hidden behind BottomNav */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>
            <BottomNav />
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Target,
    Users,
    FileText,
    Inbox,
    BarChart,
    Settings,
    PlaneTakeoff,
    LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/campaigns', label: 'Campaigns', icon: Target },
    { href: '/app/leads', label: 'Leads', icon: Users },
    { href: '/app/templates', label: 'Templates', icon: FileText },
    { href: '/app/inbox', label: 'Inbox', icon: Inbox },
    { href: '/app/analytics', label: 'Analytics', icon: BarChart },
    { href: '/app/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-muted/40">
            <aside className="w-64 border-r bg-background flex flex-col hidden md:flex sticky top-0 h-screen">
                <div className="h-16 flex items-center px-6 border-b shrink-0">
                    <PlaneTakeoff className="h-6 w-6 text-primary mr-2" />
                    <span className="font-bold text-lg">LeadPilot</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-foreground'
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t sticky bottom-0">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 flex items-center md:hidden px-4 border-b bg-background sticky top-0 z-10 w-full">
                    <PlaneTakeoff className="h-6 w-6 text-primary mr-2" />
                    <span className="font-bold text-lg">LeadPilot</span>
                </header>
                <div className="flex-1 p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

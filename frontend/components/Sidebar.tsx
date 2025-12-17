'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Search,
    MessageSquare,
    Calendar,
    CreditCard,
    User,
    FileText,
    LogOut,
    ShieldCheck
} from 'lucide-react';

const studentLinks = [
    { href: '/dashboard/student', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/student/search', label: 'Find Tutors', icon: Search },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/dashboard/wallet', label: 'Wallet', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const tutorLinks = [
    { href: '/dashboard/tutor', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/tutor/requests', label: 'Requests', icon: Calendar },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/tutor/content', label: 'Content Hub', icon: FileText },
    { href: '/dashboard/wallet', label: 'Earnings', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/tutor/verification', label: 'Verification', icon: ShieldCheck },
];

export default function Sidebar({ role }: { role: 'student' | 'tutor' }) {
    const pathname = usePathname();
    const links = role === 'student' ? studentLinks : tutorLinks;

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-40">
            <div className="p-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg"></div>
                    <span className="text-xl font-bold text-slate-900">TutorEveryone</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-indigo-50 text-primary font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        window.dispatchEvent(new Event('auth-change'));
                        // Optional: Redirect will be handled by auth-change listener or we can force it
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

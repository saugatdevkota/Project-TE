'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    if (isDashboard) {
        return (
            <div className="flex flex-col min-h-screen animate-fade-in">
                <main className="flex-grow">
                    {children}
                </main>
                <div className="pl-64">
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 pt-20 pb-20">
                {children}
            </main>
            <Footer />
        </>
    );
}

'use client';

import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [role, setRole] = useState<'student' | 'tutor' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/login');
                return;
            }
            try {
                const user = JSON.parse(userStr);
                setRole(user.role as 'student' | 'tutor');
            } catch (e) {
                // Corrupt data
                localStorage.removeItem('user');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Listen for logout events (though Navbar usually handles redirect, this is a safety net)
        window.addEventListener('auth-change', checkAuth);
        return () => window.removeEventListener('auth-change', checkAuth);
    }, [router]);

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
    }

    if (!role) return null; // Should have redirected

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar role={role} />
            <main className="pl-64 min-h-screen">
                <div className="container mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

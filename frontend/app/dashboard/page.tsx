'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'tutor') {
                router.push('/dashboard/tutor');
            } else {
                router.push('/dashboard/student');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-slate-500">Redirecting...</p>
        </div>
    );
}

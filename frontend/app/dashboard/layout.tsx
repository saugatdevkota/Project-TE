'use client';

import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [role, setRole] = useState<'student' | 'tutor'>('student');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role as 'student' | 'tutor');
        }
    }, []);

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

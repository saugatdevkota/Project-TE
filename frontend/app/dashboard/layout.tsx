'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In a real app, this would come from auth context
    const [role] = useState<'student' | 'tutor'>('student');

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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ revenue: 12500, tutors: 45, pending: 3 });
    const [tutors, setTutors] = useState<any[]>([]);

    useEffect(() => {
        // Fetch real tutors
        const fetchTutors = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/tutors`); // Fetch all
                if (res.ok) {
                    const data = await res.json();
                    setTutors(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchTutors();
    }, []);

    const handleVerify = async (id: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/tutors/${id}/approve`, {
                method: 'POST',
            });
            if (res.ok) {
                alert('Tutor verified successfully!');
                // Refresh list
                setTutors(tutors.map(t => t.tutor_id === id ? { ...t, status: 'verified' } : t));
            } else {
                alert('Failed to verify tutor');
            }
        } catch (error) {
            console.error(error);
            alert('Error verifying tutor');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-tight">TE Admin</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-lg text-white font-medium">
                        <span>📊</span> Dashboard
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <span>👥</span> Users
                    </Link>
                    <Link href="/admin/finance" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <span>💰</span> Finance
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <Link href="/" className="text-slate-400 hover:text-white text-sm">← Back to Site</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">System Overview</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 text-sm font-bold uppercase mb-1">Total Revenue</div>
                        <div className="text-3xl font-extrabold text-slate-900">${stats.revenue.toLocaleString()}</div>
                        <div className="text-emerald-500 text-sm font-bold mt-2">↑ 12% vs last month</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 text-sm font-bold uppercase mb-1">Active Tutors</div>
                        <div className="text-3xl font-extrabold text-slate-900">{tutors.length}</div>
                        <div className="text-slate-400 text-sm mt-2">Platform growing steady</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 text-sm font-bold uppercase mb-1">Pending Verifications</div>
                        <div className="text-3xl font-extrabold text-amber-500">{stats.pending}</div>
                        <div className="text-slate-400 text-sm mt-2">Requires immediate attention</div>
                    </div>
                </div>

                {/* Verification Queue */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900 text-lg">Tutor Verification Queue</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Tutor</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tutors.map((tutor) => (
                                <tr key={tutor.tutor_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{tutor.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{Array.isArray(tutor.subjects) ? tutor.subjects[0] : 'General'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tutor.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {tutor.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {tutor.status !== 'verified' && (
                                            <button
                                                onClick={() => handleVerify(tutor.tutor_id)}
                                                className="text-emerald-600 hover:text-emerald-900 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

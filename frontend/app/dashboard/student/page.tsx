'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddFundsModal from '@/components/AddFundsModal';

export default function StudentDashboard() {
    const [balance, setBalance] = useState(0);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [userName, setUserName] = useState('Student');

    const [tutors, setTutors] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);

    // Fetch Wallet, User, Tutors, Bookings
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserName(user.name);
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const headers = { 'Authorization': `Bearer ${token}` };

            // Parallel fetch
            const [walletRes, tutorsRes] = await Promise.all([
                fetch(`${API_URL}/wallet`, { headers }),
                fetch(`${API_URL}/tutors`)
            ]);

            if (walletRes.ok) {
                const walletData = await walletRes.json();
                setBalance(walletData.balance);
            }

            if (tutorsRes.ok) {
                const tutorsData = await tutorsRes.json();
                // Pick random 2 for recommendation
                setTutors(tutorsData.slice(0, 2));
            }

            // Fetch bookings (if endpoint exists/is reliable)
            try {
                const bookingsRes = await fetch(`${API_URL}/bookings`, { headers });
                if (bookingsRes.ok) {
                    const bData = await bookingsRes.json();
                    setBookings(Array.isArray(bData) ? bData : []);
                }
            } catch (e) { console.warn("Bookings fetch failed", e); }


        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8 container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hello, {userName}!</h1>
                    <p className="text-slate-600">Ready to learn something new today?</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                    Find a Tutor
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wallet Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg border border-indigo-700 relative overflow-hidden group text-white">
                    <div className="relative z-10">
                        <div className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                            Wallet Balance
                        </div>
                        <div className="text-4xl font-extrabold mb-4">${Number(balance).toFixed(2)}</div>
                        <button
                            onClick={() => setIsAddFundsOpen(true)}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                            + Add Funds
                        </button>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full z-0 group-hover:scale-150 transition-transform duration-500"></div>
                </div>

                {/* Upcoming Sessions Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Upcoming Sessions</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">{bookings.filter((b: any) => b.status === 'upcoming' || b.status === 'confirmed').length}</div>
                    <Link href="/dashboard/bookings" className="text-primary font-bold text-sm hover:underline">View Schedule →</Link>
                </div>

                {/* Total Hours Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Learning Hours</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">0.0</div>
                    <span className="text-xs text-slate-400">Keep it up! you're doing great.</span>
                </div>
            </div>

            {/* Recommended Tutors */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Recommended Tutors</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Quick Cards reuse */}
                    {tutors.map((tutor) => (
                        <div key={tutor.id} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4 group cursor-pointer">
                            <div className="w-16 h-16 bg-indigo-50 rounded-lg flex items-center justify-center text-xl font-bold text-indigo-300 group-hover:bg-primary group-hover:text-white transition-colors">
                                {tutor.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{tutor.name}</div>
                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{tutor.subjects ? JSON.parse(tutor.subjects as any)[0] : 'Tutor'}</div>
                                <div className="text-sm font-bold text-slate-900 mt-1">${tutor.hourly_rate}/h</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                </div>
                <div className="p-12 text-center text-slate-400">
                    No recent activity to show.
                </div>
            </div>

            <AddFundsModal
                isOpen={isAddFundsOpen}
                onClose={() => setIsAddFundsOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}

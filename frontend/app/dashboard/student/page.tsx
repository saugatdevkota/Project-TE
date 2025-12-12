'use client';

import { useState, useEffect } from 'react';
import AddFundsModal from '@/components/AddFundsModal';

export default function StudentDashboard() {
    const [balance, setBalance] = useState(0);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [userName, setUserName] = useState('Student');

    // Fetch Wallet & User Info
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserName(user.name);
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/wallet`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setBalance(data.balance);
            }
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Wallet Balance</div>
                        <div className="text-4xl font-extrabold text-slate-900 mb-4">${Number(balance).toFixed(2)}</div>
                        <button
                            onClick={() => setIsAddFundsOpen(true)}
                            className="text-primary font-bold hover:underline text-sm flex items-center gap-1"
                        >
                            + Add Funds
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full z-0 group-hover:scale-150 transition-transform duration-500"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Upcoming Sessions</div>
                    <div className="text-4xl font-extrabold text-slate-900">0</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Hours</div>
                    <div className="text-4xl font-extrabold text-slate-900">0.0</div>
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

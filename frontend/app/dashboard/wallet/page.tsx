'use client';

import { useState, useEffect } from 'react';
import AddFundsModal from '@/components/AddFundsModal';

export default function WalletPage() {
    const [role, setRole] = useState('student');
    const [balance, setBalance] = useState(0.00);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

    const fetchWallet = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/wallet`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setBalance(data.balance);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role);
        }
        fetchWallet();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                {role === 'tutor' ? 'Earnings & Payouts' : 'My Wallet'}
            </h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Balance Card */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Available Balance</div>
                        <div className="text-5xl font-extrabold mb-8">${Number(balance).toFixed(2)}</div>

                        {role === 'student' ? (
                            <button
                                onClick={() => setIsAddFundsOpen(true)}
                                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors w-full"
                            >
                                + Add Funds
                            </button>
                        ) : (
                            <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors w-full shadow-lg shadow-emerald-500/20">
                                Request Payout
                            </button>
                        )}
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                </div>

                {/* Bank / Payment Method Card */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">🏦</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {role === 'tutor' ? 'Payout Method' : 'Payment Methods'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {role === 'tutor' ? 'Connect your bank account to receive earnings.' : 'Manage your saved cards and billing info.'}
                    </p>
                    <button className="text-primary font-bold hover:underline">Manage Settings</button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Transaction History</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {/* Mock Data */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === 'tutor' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {role === 'tutor' ? '↓' : '↑'}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{role === 'tutor' ? 'Lesson Payment' : 'Wallet Deposit'}</div>
                                    <div className="text-xs text-slate-500">Dec {10 + i}, 2024</div>
                                </div>
                            </div>
                            <div className={`font-bold ${role === 'tutor' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {role === 'tutor' ? '+' : '+'}${50 * i}.00
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddFundsModal
                isOpen={isAddFundsOpen}
                onClose={() => setIsAddFundsOpen(false)}
                onSuccess={fetchWallet}
            />
        </div>
    );
}

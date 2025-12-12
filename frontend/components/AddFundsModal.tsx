'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddFundsModal({ isOpen, onClose, onSuccess }: AddFundsModalProps) {
    const [amount, setAmount] = useState(1000);
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<'card' | 'esewa' | 'khalti'>('esewa');

    if (!isOpen) return null;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Adjust amount for simulation display (convert to NPR implicitly or keep USD)
            // Let's assume the platform uses "credits" which maps 1:1 to simulated currency
            const finalAmount = amount;

            const res = await fetch(`${API_URL}/wallet/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: finalAmount }),
            });

            if (res.ok) {
                setTimeout(() => { // Simulate processing delay
                    onSuccess();
                    onClose();
                    setLoading(false);
                }, 2000);
            } else {
                alert('Payment failed');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">Add Funds to Wallet</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="p-6">
                    {/* Method Selector */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setMethod('esewa')}
                            className={`flex-1 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'esewa' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 grayscale hover:grayscale-0'}`}
                        >
                            <div className="font-bold text-sm">eSewa</div>
                        </button>
                        <button
                            onClick={() => setMethod('khalti')}
                            className={`flex-1 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'khalti' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 grayscale hover:grayscale-0'}`}
                        >
                            <div className="font-bold text-sm">Khalti</div>
                        </button>
                        <button
                            onClick={() => setMethod('card')}
                            className={`flex-1 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'card' ? 'border-slate-800 bg-slate-100 text-slate-900' : 'border-slate-100 grayscale hover:grayscale-0'}`}
                        >
                            <div className="font-bold text-sm">Card</div>
                        </button>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (NPR)</label>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {[500, 1000, 2000].map((amt) => (
                                    <button
                                        type="button"
                                        key={amt}
                                        onClick={() => setAmount(amt)}
                                        className={`py-2 rounded-lg font-bold border text-sm ${amount === amt ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Rs. {amt}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rs.</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900 text-lg"
                                />
                            </div>
                        </div>

                        {/* Provider Specific Input Mockup */}
                        {method === 'esewa' && (
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">🆔</div>
                                <div>
                                    <div className="text-xs text-emerald-700 font-bold uppercase">eSewa ID</div>
                                    <input type="text" placeholder="98XXXXXXXX" className="bg-transparent text-emerald-900 font-bold outline-none w-full placeholder-emerald-300/70" />
                                </div>
                            </div>
                        )}

                        {method === 'khalti' && (
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">🆔</div>
                                <div>
                                    <div className="text-xs text-indigo-700 font-bold uppercase">Khalti ID</div>
                                    <input type="text" placeholder="98XXXXXXXX" className="bg-transparent text-indigo-900 font-bold outline-none w-full placeholder-indigo-300/70" />
                                </div>
                            </div>
                        )}

                        {method === 'card' && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <input type="text" placeholder="Card Number" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none mb-3" disabled />
                                <div className="flex gap-3">
                                    <input type="text" placeholder="MM/YY" className="w-1/2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" disabled />
                                    <input type="text" placeholder="CVC" className="w-1/2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" disabled />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                                ${method === 'esewa' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' : ''}
                                ${method === 'khalti' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30' : ''}
                                ${method === 'card' ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30' : ''}
                            `}
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>Load Fund</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

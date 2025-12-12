'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
    const [view, setView] = useState<'student' | 'tutor'>('student');

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Transparent Pricing for Everyone</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
                    Whether you are learning or teaching, we believe in fair and simple fees.
                </p>

                {/* Toggle */}
                <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-16 relative">
                    <button
                        onClick={() => setView('student')}
                        className={`relative z-10 px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${view === 'student' ? 'text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        For Students
                    </button>
                    <button
                        onClick={() => setView('tutor')}
                        className={`relative z-10 px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${view === 'tutor' ? 'text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        For Tutors
                    </button>
                    {/* Animated Background */}
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-100 rounded-lg transition-all duration-300 ${view === 'student' ? 'left-1' : 'left-[calc(50%+2px)]'}`}></div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    {view === 'student' ? (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in border border-slate-100">
                            <div className="bg-indigo-600 p-10 text-white">
                                <h3 className="text-2xl font-bold mb-2">Learner Pass</h3>
                                <div className="text-6xl font-extrabold mb-4">$0 <span className="text-2xl font-medium opacity-80">/month</span></div>
                                <p className="text-indigo-100">Pay only for the lessons you book. No hidden membership fees.</p>
                            </div>
                            <div className="p-10 text-left">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Free access to 10,000+ Tutors
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Book Free Trial Sessions
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Secure Escrow Payments
                                        </li>
                                    </ul>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Pay Per Lesson
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            24/7 Support
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Cancel anytime
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-10 text-center">
                                    <Link href="/tutors" className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-600/30">
                                        Find a Tutor Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in border border-slate-100">
                            <div className="bg-slate-900 p-10 text-white">
                                <h3 className="text-2xl font-bold mb-2">Tutor Success Plan</h3>
                                <div className="text-6xl font-extrabold mb-4">10% <span className="text-2xl font-medium opacity-80">commission</span></div>
                                <p className="text-slate-400">We only earn when you earn. Keep 90% of your income.</p>
                            </div>
                            <div className="p-10 text-left">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Free Profile Listing
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Marketing Tools Included
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Automated Billing & Invoicing
                                        </li>
                                    </ul>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Student Matching Algorithm
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Protected Payments
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-700">
                                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
                                            Instant Withdrawals
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-10 text-center">
                                    <Link href="/become-tutor" className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/30">
                                        Create Tutor Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

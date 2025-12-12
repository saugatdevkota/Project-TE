'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for user data
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">TE</div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">TutorEverywhere</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 font-medium">
                    {!user ? (
                        // Guest Links
                        <>
                            <Link href="/tutors" className="text-slate-600 hover:text-primary transition-colors">Find Tutors</Link>
                            <Link href="/pricing" className="text-slate-600 hover:text-primary transition-colors">Pricing</Link>
                            <Link href="/about" className="text-slate-600 hover:text-primary transition-colors">About</Link>
                        </>
                    ) : user.role === 'tutor' ? (
                        // Tutor Links
                        <>
                            <Link href="/dashboard/tutor/requests" className="text-slate-600 hover:text-primary transition-colors">Requests</Link>
                            <Link href="/dashboard/wallet" className="text-slate-600 hover:text-primary transition-colors">Earnings</Link>
                            <Link href="/dashboard/messages" className="text-slate-600 hover:text-primary transition-colors">Messages</Link>
                        </>
                    ) : (
                        // Student Links
                        <>
                            <Link href="/tutors" className="text-slate-600 hover:text-primary transition-colors">Find Tutors</Link>
                            <Link href="/dashboard/bookings" className="text-slate-600 hover:text-primary transition-colors">My Bookings</Link>
                            <Link href="/dashboard/messages" className="text-slate-600 hover:text-primary transition-colors">Messages</Link>
                        </>
                    )}
                </nav>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4 animate-fade-in">
                            <span className="hidden md:block text-slate-600 font-medium">
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            <Link href="/dashboard" className="bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 hover:text-rose-600 font-semibold px-2 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-slate-700 hover:text-primary font-semibold px-4 py-2">Log in</Link>
                            <Link href="/signup" className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

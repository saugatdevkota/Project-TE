'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        setLoading(false);
    }, []);

    if (loading) return null; // Avoid hydration mismatch

    if (!user) {
        return <MarketingHome />;
    }

    if (user.role === 'tutor') {
        return <TutorHome user={user} />;
    }

    return <StudentHome user={user} />;
}

// ----------------------------------------------------------------------
// 1. Marketing / Guest View
// ----------------------------------------------------------------------
function MarketingHome() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            {/* Note: Navbar is handled globally in layout.tsx */}

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-indigo-50 to-white opacity-60 rounded-bl-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-emerald-50 to-white opacity-60 rounded-tr-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 bg-indigo-50 text-primary rounded-full text-sm font-semibold mb-8 border border-indigo-100 shadow-sm animate-fade-in-up">
                        ✨ #1 Global Tutoring Marketplace
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight max-w-5xl mx-auto">
                        Unlock Your Potential with <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">World-Class Experts</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join 50,000+ students mastering new skills. Get <b>AI-matched</b> with verified tutors, book instant lessons, and pay securely.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link href="/tutors" className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl shadow-primary/20">
                            Find a Tutor
                        </Link>
                        <Link href="/become-tutor" className="w-full sm:w-auto bg-white text-slate-800 border-2 border-slate-100 px-10 py-4 rounded-xl text-lg font-bold hover:border-slate-300 hover:bg-slate-50 transition-all">
                            Become a Tutor
                        </Link>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="font-bold text-slate-400 text-xl">Trusted by students from top universities</span>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-primary py-12 text-white shadow-inner">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                        <div>
                            <div className="text-4xl font-bold mb-1">10k+</div>
                            <div className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Active Tutors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-1">50k+</div>
                            <div className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Students</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-1">1M+</div>
                            <div className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Lessons Taught</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-1">4.9/5</div>
                            <div className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Subjects */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Learn Anything, Anytime</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">From academic subjects to hobbies, we have experts for everything.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['Mathematics', 'English Language', 'Computer Science', 'Physics', 'Music', 'Business', 'Art & Design', 'Foreign Languages'].map((subject) => (
                            <Link href={`/tutors?subject=${subject}`} key={subject} className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{subject}</h3>
                                <p className="text-sm text-slate-500 mt-2">1,200+ Tutors</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">TE</div>
                                <span className="text-xl font-bold text-slate-900">TutorEverywhere</span>
                            </div>
                            <p className="text-slate-500">Democratizing education through technology and trust.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Learn</h4>
                            <ul className="space-y-3 text-slate-600">
                                <li><Link href="/tutors" className="hover:text-primary">Find Tutors</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                                <li><Link href="/courses" className="hover:text-primary">Online Courses</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Teach</h4>
                            <ul className="space-y-3 text-slate-600">
                                <li><Link href="/become-tutor" className="hover:text-primary">Become a Tutor</Link></li>
                                <li><Link href="/tutor-rules" className="hover:text-primary">Rules & Safety</Link></li>
                                <li><Link href="/success-stories" className="hover:text-primary">Success Stories</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
                            <ul className="space-y-3 text-slate-600">
                                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-slate-400 pt-8 border-t border-slate-100">
                        © 2025 TutorEverywhere Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Student View
// ----------------------------------------------------------------------
function StudentHome({ user }: { user: any }) {
    return (
        <div className="min-h-screen bg-slate-50 pt-20"> {/* pt-20 for fixed navbar */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-600 mb-8">Ready to continue your learning journey?</p>

                    {/* Search Hero */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 max-w-3xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 relative z-10">Find your next tutor</h2>
                        <div className="flex gap-4 relative z-10">
                            <input
                                type="text"
                                placeholder="What subject do you need help with?"
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Link href="/tutors" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                                Search
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Dashboard Stats */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Your Activity</h3>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-600">Upcoming Lessons</span>
                            <span className="font-bold text-primary bg-indigo-50 px-3 py-1 rounded-full">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Wallet Balance</span>
                            <span className="font-bold text-slate-900">$0.00</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <Link href="/dashboard/student" className="text-primary font-bold text-sm hover:underline">Go to Dashboard →</Link>
                        </div>
                    </div>

                    {/* Recommended Tutors */}
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-slate-900 mb-6 text-xl">Recommended for you</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Quick Cards reuse */}
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                                    <div>
                                        <div className="font-bold text-slate-900">Dr. Sarah Wilson</div>
                                        <div className="text-xs text-slate-500">Mathematics</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">$45/h</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Link href="/tutors" className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors inline-block">
                                Browse All Tutors
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Tutor View
// ----------------------------------------------------------------------
function TutorHome({ user }: { user: any }) {
    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <div className="bg-slate-900 text-white border-b border-indigo-900">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Hello, {user.name.split(' ')[0]}!</h1>
                            <p className="text-indigo-200">Manage your tutoring business.</p>
                        </div>
                        <Link href="/dashboard/tutor" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30">
                            My Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8">
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Earnings (Month)</div>
                        <div className="text-3xl font-extrabold text-slate-900">$0.00</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">New Requests</div>
                        <div className="text-3xl font-extrabold text-primary">0</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Upcoming Class</div>
                        <div className="text-lg font-bold text-slate-900">No classes</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col justify-center">
                        <Link href="/dashboard/tutor/requests" className="text-center text-primary font-bold hover:underline">
                            View All Requests →
                        </Link>
                    </div>
                </div>

                <div className="py-12 grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-6 text-xl">Quick Actions</h3>
                        <div className="space-y-4">
                            <Link href="/dashboard/profile" className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-primary transition-colors">
                                <span className="font-bold text-slate-900">Edit Profile</span>
                                <p className="text-sm text-slate-500">Update your bio, subjects, and rates.</p>
                            </Link>
                            <Link href="/dashboard/wallet" className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-primary transition-colors">
                                <span className="font-bold text-slate-900">Withdraw Earnings</span>
                                <p className="text-sm text-slate-500">Manage your payout methods.</p>
                            </Link>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-4">💡 Pro Tip</h3>
                        <p className="text-indigo-700 mb-4">Tutors with verified badges get 3x more bookings. Upload your documents today to get verified.</p>
                        <Link href="/dashboard/tutor/verification" className="text-indigo-600 font-bold hover:underline text-sm">
                            Go to Verification →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

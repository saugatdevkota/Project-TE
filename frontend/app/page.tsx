"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
    const [tutors, setTutors] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // 1. Check User
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // 2. Fetch Tutors for Grid
        api.get('/tutors').then(data => {
            if (Array.isArray(data)) {
                setTutors(data.slice(0, 8)); // Top 8
            } else {
                console.warn("API returned invalid tutor data:", data);
                setTutors([]);
            }
        }).catch(err => {
            console.error("Failed to load tutors", err);
            setTutors([]);
        });
    }, []);

    // 1. Logged In Student View
    if (user && user.role === 'student') {
        return (
            <div className="min-h-screen bg-gray-50 pt-10">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, {user.name}! 👋</h1>
                        <p className="text-gray-600 mb-8">Ready to continue learning?</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/dashboard/student" className="block p-6 bg-indigo-50 rounded-2xl border border-indigo-100 hover:shadow-md transition group">
                                <h3 className="font-bold text-lg text-indigo-700 mb-2 group-hover:text-indigo-800">Find a Tutor</h3>
                                <p className="text-sm text-gray-600">Browse verified tutors for your subjects.</p>
                            </Link>
                            <Link href="/dashboard/bookings" className="block p-6 bg-emerald-50 rounded-2xl border border-emerald-100 hover:shadow-md transition group">
                                <h3 className="font-bold text-lg text-emerald-700 mb-2 group-hover:text-emerald-800">Upcoming Sessions</h3>
                                <p className="text-sm text-gray-600">Check your schedule and join calls.</p>
                            </Link>
                            <Link href="/dashboard/messages" className="block p-6 bg-purple-50 rounded-2xl border border-purple-100 hover:shadow-md transition group">
                                <h3 className="font-bold text-lg text-purple-700 mb-2 group-hover:text-purple-800">Messages</h3>
                                <p className="text-sm text-gray-600">Chat with your tutors.</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 2. Logged In Tutor View
    if (user && user.role === 'tutor') {
        return (
            <div className="min-h-screen bg-gray-50 pt-10">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hello, {user.name}! 🎓</h1>
                        <p className="text-gray-600 mb-8">Manage your tutoring business.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/dashboard/tutor" className="block p-6 bg-indigo-50 rounded-2xl border border-indigo-100 hover:shadow-md transition">
                                <h3 className="font-bold text-lg text-indigo-700 mb-2">Dashboard</h3>
                                <p className="text-sm text-gray-600">View your stats and earnings.</p>
                            </Link>
                            <Link href="/dashboard/bookings" className="block p-6 bg-emerald-50 rounded-2xl border border-emerald-100 hover:shadow-md transition">
                                <h3 className="font-bold text-lg text-emerald-700 mb-2">My Sessions</h3>
                                <p className="text-sm text-gray-600">Manage your upcoming classes.</p>
                            </Link>
                            <Link href="/dashboard/tutor/content" className="block p-6 bg-rose-50 rounded-2xl border border-rose-100 hover:shadow-md transition">
                                <h3 className="font-bold text-lg text-rose-700 mb-2">Content Hub</h3>
                                <p className="text-sm text-gray-600">Upload courses and resources.</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 3. Marketing Home (Guest)
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800">

            {/* HERO SECTION */}
            <div className="relative pt-24 pb-32 bg-gradient-to-br from-white via-red-50 to-white overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                    <span className="inline-block py-1 px-4 rounded-full bg-red-100 text-primary font-bold text-sm mb-6 animate-fade-in">
                        🚀 The #1 Verified Tutoring Platform
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                        Find the perfect <br />
                        <span className="text-primary relative inline-block">
                            tutor
                        </span>
                        {" "}for you
                    </h1>

                    <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
                        Master any subject with verified experts. From languages to coding, we have the perfect match driven by AI.
                    </p>

                    {/* V2 HERO SEARCH PILL */}
                    <div className="bg-white rounded-full shadow-xl shadow-slate-200/50 p-2 max-w-4xl mx-auto flex flex-col md:flex-row items-center border border-slate-100 transform hover:scale-[1.01] transition-all duration-300">

                        {/* Subject Input */}
                        <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-slate-100">
                            <Search className="w-6 h-6 text-slate-400 mr-3" />
                            <div className="text-left w-full">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Subject</label>
                                <input type="text" placeholder='Try "Calculus" or "Piano"' className="w-full text-lg outline-none font-medium placeholder:text-slate-300" />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="flex-1 flex items-center px-6 py-3 w-full">
                            <MapPin className="w-6 h-6 text-slate-400 mr-3" />
                            <div className="text-left w-full">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Location</label>
                                <select className="w-full text-lg outline-none font-medium bg-transparent text-slate-700 cursor-pointer appearance-none">
                                    <option>Online</option>
                                    <option>In-Person (coming soon)</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button className="bg-primary hover:bg-primary-600 text-white rounded-full px-10 py-5 font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all">
                            Search
                        </button>
                    </div>

                    {/* Popular Chips */}
                    <div className="mt-8 flex justify-center gap-3 flex-wrap">
                        {['Math', 'English', 'Python', 'Guitar', 'Spanish'].map(tag => (
                            <span key={tag} className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-primary hover:text-primary cursor-pointer transition">
                                {tag}
                            </span>
                        ))}
                    </div>

                </div>
            </div>

            {/* TUTOR GRID (FACES) */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Meet our top tutors</h2>
                        <p className="text-slate-500">Rated 5 stars by thousands of students</p>
                    </div>
                    <Link href="/tutors" className="text-primary font-bold hover:underline">See all tutors →</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tutors && tutors.length > 0 ? tutors.map((tutor: any) => (
                        <Link href={`/tutor/${tutor.tutor_id || tutor.id}`} key={tutor.id} className="group">
                            <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden bg-slate-100">
                                    {tutor.profile_photo ? (
                                        <img
                                            src={tutor.profile_photo}
                                            alt={tutor.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl font-bold font-mono">
                                            {tutor.name?.[0]}
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center shadow-sm">
                                        <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                                        {tutor.rating || '5.0'}
                                    </div>
                                    {tutor.is_premium && (
                                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                            👑 SUPER
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{tutor.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{tutor.bio || "Certified tutor ready to help you learn."}</p>

                                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                                        <div className="text-slate-400 text-sm font-medium">
                                            From <span className="text-slate-800 font-bold text-lg">${tutor.hourly_rate}</span>/hr
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        // Skeletons
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="rounded-3xl bg-white border border-slate-100 p-4 shadow-sm animate-pulse">
                                <div className="h-64 bg-slate-200 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}

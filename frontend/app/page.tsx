"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { api } from '@/lib/api';
import TutorHome from '@/components/landing/TutorHome';
import StudentHome from '@/components/landing/StudentHome';

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
        return <StudentHome user={user} tutors={tutors} />;
    }

    // 2. Logged In Tutor View
    if (user && user.role === 'tutor') {
        return <TutorHome user={user} />;
    }

    // 3. Marketing Home (Guest)
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800">

            {/* HERO SECTION */}
            <div className="relative pt-20 pb-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs mb-6 border border-indigo-100">
                        🚀 The #1 Verified Tutoring Platform
                    </span>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Find the perfect <span className="text-primary">tutor</span> for you
                    </h1>

                    <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
                        Master any subject with verified experts. From languages to coding, we have the perfect match driven by AI.
                    </p>

                    {/* Clean Search Bar */}
                    <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200 flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input type="text" placeholder="What do you want to learn?" className="w-full py-3 bg-transparent text-slate-900 font-medium placeholder:text-slate-400 outline-none" />
                        </div>
                        <button className="bg-primary hover:bg-primary-700 text-white rounded-xl px-8 py-3 font-bold text-lg transition-colors">
                            Search
                        </button>
                    </div>

                    {/* Popular Chips */}
                    <div className="mt-8 flex justify-center gap-2 flex-wrap">
                        {['Math', 'English', 'Python', 'Guitar', 'Spanish'].map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-sm hover:border-primary hover:text-primary cursor-pointer transition">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Simple Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl text-sm" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50 rounded-full blur-3xl" />
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

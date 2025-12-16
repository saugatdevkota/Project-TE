'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Tutor {
    tutor_id: string;
    name: string;
    subject: string;
    subjects: string[];
    hourly_rate: number;
    rating: number;
    bio: string;
    initials?: string;
    verified?: boolean;
    image_color?: string;
    reviews?: number;
    is_premium?: boolean;
}

export default function FindTutorsPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(100);
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');

    const subjects = ['All Subjects', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Computer Science', 'History', 'Art & Design', 'Spanish', 'French'];

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/tutors`);
                const data = await res.json();

                // Enhance data for display if needed (e.g. initials, colors)
                const enhancedData = data.map((t: any) => ({
                    ...t,
                    initials: t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
                    image_color: 'bg-indigo-100', // Default color for now
                    verified: true,
                    reviews: Math.floor(Math.random() * 50) + 5 // Mock reviews count for now until we have real ones
                }));

                setTutors(enhancedData);
            } catch (error) {
                console.error('Failed to fetch tutors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    // Filter Logic
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('rating'); // rating, price-asc, price-desc

    // ... (useEffect remains same) ...
    // Note: In a real app, filtering/sorting might be server-side. For now client-side is fine for MVP.

    // Filter Logic
    const filteredTutors = tutors.filter(tutor => {
        const matchesPrice = tutor.hourly_rate <= priceRange;
        const matchesSubject = selectedSubject === 'All Subjects' || (tutor.subjects && tutor.subjects.includes(selectedSubject));

        const term = searchTerm.toLowerCase();
        const matchesSearch = tutor.name.toLowerCase().includes(term) ||
            (tutor.subjects && tutor.subjects.join(' ').toLowerCase().includes(term)) ||
            tutor.bio.toLowerCase().includes(term);

        return matchesPrice && matchesSubject && matchesSearch;
    }).sort((a, b) => {
        if (sortOption === 'price-asc') return a.hourly_rate - b.hourly_rate;
        if (sortOption === 'price-desc') return b.hourly_rate - a.hourly_rate;
        if (sortOption === 'rating') return b.rating - a.rating;
        return 0;
    });

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Note: Navbar is Global now, so we don't need to import it here usually, but layout handles it. 
                 However, to be safe against layout inconsistencies, relying on layout.tsx is best. */}

            {/* Search Header */}
            <div className="bg-white border-b border-slate-200 sticky top-20 z-40">
                <div className="container mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Find the perfect tutor for you</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="What do you want to learn? (e.g. 'Math', 'Piano')"
                                className="w-full pl-6 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative min-w-[200px]">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full h-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary outline-none text-slate-900 bg-white"
                            >
                                <option value="rating">Top Rated</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                        <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:w-1/4 space-y-8 h-fit sticky top-48">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">Subject</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {subjects.map((subj) => (
                                <label key={subj} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="subject"
                                            checked={selectedSubject === subj}
                                            onChange={() => setSelectedSubject(subj)}
                                            className="accent-primary w-4 h-4"
                                        />
                                    </div>
                                    <span className={`transition-colors ${selectedSubject === subj ? 'text-primary font-bold' : 'text-slate-600 group-hover:text-primary'}`}>{subj}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">Max Price: ${priceRange}/h</h3>
                        <div className="px-2">
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </div>
                </aside>

                {/* Tutors Grid */}
                <main className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">{filteredTutors.length} Tutors Available</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredTutors.map((tutor) => (
                                <div key={tutor.tutor_id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 group">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 relative mx-auto md:mx-0">
                                        <div className={`w-32 h-32 ${tutor.image_color} rounded-2xl flex items-center justify-center text-3xl font-bold text-slate-700`}>
                                            {tutor.initials}
                                        </div>
                                        {tutor.verified && (
                                            <div className="absolute -bottom-3 -right-3 bg-white p-1 rounded-full shadow-sm">
                                                <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <span>✓</span> Verified
                                                </div>
                                            </div>
                                        )}
                                        {tutor.is_premium && (
                                            <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-sm z-10">
                                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                                    <span>👑</span> PREMIUM
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{tutor.name}</h3>
                                                <p className="text-slate-500 font-medium">Expert in {tutor.subjects ? JSON.parse(tutor.subjects as any)[0] : 'Various Subjects'}</p>
                                            </div>
                                            <div className="flex flex-col items-center md:items-end mt-2 md:mt-0">
                                                <div className="text-2xl font-bold text-slate-900">${tutor.hourly_rate}<span className="text-sm font-normal text-slate-500">/h</span></div>
                                                <div className="flex items-center gap-1 text-sm mt-1">
                                                    <span className="text-amber-400">★</span>
                                                    <span className="font-bold text-slate-900">{tutor.rating}</span>
                                                    <span className="text-slate-400">({tutor.reviews} reviews)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 mb-4 line-clamp-2">{tutor.bio}</p>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Link href={`/book/${tutor.tutor_id}`} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors text-center shadow-lg shadow-primary/20">
                                                Book Trial Lesson
                                            </Link>
                                            <button className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredTutors.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <h3 className="text-xl font-bold text-slate-400">No tutors found matching your criteria.</h3>
                                    <button onClick={() => { setPriceRange(100); setSelectedSubject('All Subjects') }} className="mt-4 text-primary font-bold hover:underline">Reset Filters</button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

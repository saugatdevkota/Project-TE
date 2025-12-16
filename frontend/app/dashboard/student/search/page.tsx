'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Star, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Tutor {
    tutor_id: string;
    name: string;
    subjects: string[] | string; // Handle both cases
    hourly_rate: number;
    rating: number;
    bio: string;
    verified?: boolean;
}

export default function TutorSearchPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(200);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const data = await api.get('/tutors');
                // Enhance data
                const enhanced = data.map((t: any) => ({
                    ...t,
                    rating: t.rating || 5.0,
                    verified: true,
                    // Parse subjects if string
                    subjects: typeof t.subjects === 'string' ? JSON.parse(t.subjects) : t.subjects
                }));
                setTutors(enhanced);
            } catch (error) {
                console.error('Failed to fetch tutors', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, []);

    const filteredTutors = tutors.filter(tutor => {
        const term = searchQuery.toLowerCase();
        const subjectsArray = Array.isArray(tutor.subjects) ? tutor.subjects : [];
        const matchesSearch = tutor.name.toLowerCase().includes(term) ||
            subjectsArray.join(' ').toLowerCase().includes(term) ||
            tutor.bio.toLowerCase().includes(term);
        const matchesPrice = tutor.hourly_rate <= priceRange;
        return matchesSearch && matchesPrice;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Find a Tutor</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by subject, name, or skill..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 animate-fade-in-down">
                    <h3 className="font-bold text-slate-900 mb-4">Max Price: ${priceRange}/hr</h3>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : filteredTutors.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    No tutors found matching your search.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTutors.map((tutor) => (
                        <div key={tutor.tutor_id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="p-6 flex-grow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg`}>
                                            {tutor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 flex items-center gap-1 line-clamp-1">
                                                {tutor.name}
                                                {tutor.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-1">
                                                {Array.isArray(tutor.subjects) ? tutor.subjects[0] : 'Tutor'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-700 text-sm font-medium">
                                        <Star className="w-3 h-3 fill-current" />
                                        {tutor.rating}
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                    {tutor.bio}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {Array.isArray(tutor.subjects) && tutor.subjects.slice(0, 3).map((sub: string) => (
                                        <span key={sub} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 mt-auto">
                                <div>
                                    <span className="text-lg font-bold text-slate-900">${tutor.hourly_rate}</span>
                                    <span className="text-slate-500 text-sm">/hr</span>
                                </div>
                                <Link href={`/book/${tutor.tutor_id}`} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                    Book Trial
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

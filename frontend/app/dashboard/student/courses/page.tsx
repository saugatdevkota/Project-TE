'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Search, Filter, ShoppingCart, PlayCircle, Star, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, math, science, language
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // In a real app, we'd have a specific endpoint for "marketplace" courses
            // For now, using the general collections endpoint
            const res = await api.get('/content/collections');
            setCourses(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = (courseId: string) => {
        // Mock purchase flow
        alert(`Initiating purchase for course ${courseId}...`);
        // redirect to checkout or open modal
    };

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || (c.subject && c.subject.toLowerCase() === filter);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Courses</h1>
                <p className="text-slate-500">Master new skills with curated courses from top tutors.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-slate-900 placeholder:text-slate-400"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['all', 'math', 'science', 'english', 'coding'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">No courses found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            {/* Thumbnail */}
                            <div className="h-48 bg-slate-200 relative overflow-hidden">
                                <img
                                    src={course.thumbnail_url || `https://source.unsplash.com/random/800x600?${course.title}`}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    4.8 (120)
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-primary bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wide">
                                        {course.subject || 'General'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> 12h 40m
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                                    {course.description || "Master this subject with our comprehensive guide and resources."}
                                </p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                                            {/* Mock Avatar */}
                                            <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-500">T</div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">Dr. Tutor</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-slate-900">
                                            {course.price ? `$${course.price}` : 'Free'}
                                        </span>
                                        <button
                                            onClick={() => handlePurchase(course.id)}
                                            className="p-2 bg-slate-900 text-white rounded-full hover:bg-primary transition-colors shadow-lg shadow-slate-900/20 group-hover:shadow-primary/30"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

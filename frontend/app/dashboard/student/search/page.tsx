'use client';

import { useState } from 'react';
import { Search, Filter, Star, ShieldCheck } from 'lucide-react';

export default function TutorSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');

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
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 flex items-center gap-1">
                                            Sarah Smith
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        </h3>
                                        <p className="text-sm text-slate-500">Mathematics Expert</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-700 text-sm font-medium">
                                    <Star className="w-3 h-3 fill-current" />
                                    4.9
                                </div>
                            </div>

                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                I help students master Calculus and Algebra with personalized lesson plans and patience.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Calculus</span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Algebra</span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">SAT Math</span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div>
                                    <span className="text-lg font-bold text-slate-900">$45</span>
                                    <span className="text-slate-500 text-sm">/hr</span>
                                </div>
                                <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                    Book Trial
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { FileText, Video, PlayCircle, Lock, Download } from 'lucide-react';

export default function ContentHubPage() {
    const [filter, setFilter] = useState('all');

    const resources = [
        { id: 1, title: 'Calculus 101 Cheat Sheet', type: 'pdf', price: 0, downloads: 120, author: 'Sarah Smith' },
        { id: 2, title: 'Advanced Physics Mechanics', type: 'video', price: 15, downloads: 45, author: 'John Doe' },
        { id: 3, title: 'SAT Math Prep Course', type: 'course', price: 49, downloads: 12, author: 'Sarah Smith' },
        { id: 4, title: 'Chemistry Lab Safety', type: 'pdf', price: 0, downloads: 89, author: 'Mike Ross' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Learning Resources</h1>
                    <p className="text-slate-600">Access study materials from top tutors.</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'pdf', 'video', 'course'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f
                                    ? 'bg-primary text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                            {resource.type === 'pdf' && <FileText className="w-12 h-12 text-slate-400" />}
                            {resource.type === 'video' && <Video className="w-12 h-12 text-slate-400" />}
                            {resource.type === 'course' && <PlayCircle className="w-12 h-12 text-slate-400" />}

                            {resource.price > 0 && (
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    ${resource.price}
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${resource.type === 'pdf' ? 'bg-red-50 text-red-600' :
                                        resource.type === 'video' ? 'bg-blue-50 text-blue-600' :
                                            'bg-purple-50 text-purple-600'
                                    }`}>
                                    {resource.type}
                                </span>
                                <span className="text-xs text-slate-500">{resource.downloads} downloads</span>
                            </div>

                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{resource.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">by {resource.author}</p>

                            <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                                {resource.price === 0 ? (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Download Free
                                    </>
                                ) : (
                                    <>
                                        Purchase Access
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

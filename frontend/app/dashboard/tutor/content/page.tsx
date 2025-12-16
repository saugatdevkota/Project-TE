'use client';

import { useState, useEffect } from 'react';
import { FileText, Video, PlayCircle, Lock, Plus, Trash2, Edit } from 'lucide-react';
import { api } from '@/lib/api';

export default function ContentHubPage() {
    const [activeTab, setActiveTab] = useState<'courses' | 'resources'>('courses');
    const [items, setItems] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);

    // User State
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const u = JSON.parse(userStr);
            setUser(u);
            fetchData(u.id);
        }
    }, []);

    const fetchData = async (tutorId: string) => {
        setLoading(true);
        try {
            // Fetch Collections
            const cols = await api.get(`/content/collections?tutorId=${tutorId}`);
            setCollections(cols);

            // Fetch Items
            const res = await api.get(`/content/items?tutorId=${tutorId}&type=All Types`);
            setItems(res || []);
        } catch (error) {
            console.error("Failed to load content", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = {
            tutorId: user.id,
            title: (form.elements.namedItem('title') as HTMLInputElement).value,
            description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
            price: (form.elements.namedItem('price') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
            visibility: 'public'
        };

        try {
            await api.post('/content/collections', data);
            setShowCollectionModal(false);
            fetchData(user.id);
        } catch (err) {
            alert('Failed to create course');
        }
    };

    const handleUploadResource = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const fileInput = form.elements.namedItem('file') as HTMLInputElement;

        if (!fileInput.files?.length) return;

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            // 1. Upload File
            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            // 2. Create Content Record
            const data = {
                tutorId: user.id,
                title: (form.elements.namedItem('title') as HTMLInputElement).value,
                description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                type: (form.elements.namedItem('type') as HTMLSelectElement).value,
                price: (form.elements.namedItem('price') as HTMLInputElement).value,
                subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
                grade_level: (form.elements.namedItem('grade') as HTMLSelectElement).value,
                fileUrl: uploadData.url,
                visibility: 'public'
            };

            await api.post('/content/items', data);
            setShowUploadModal(false);
            fetchData(user.id);
        } catch (err) {
            alert('Failed to upload resource');
        }
    };


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Creator Studio</h1>
                    <p className="text-slate-600">Manage your courses and learning resources.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCollectionModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
                        <Plus className="w-4 h-4" /> New Course
                    </button>
                    <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-600 transition shadow-lg shadow-primary/30">
                        <Plus className="w-4 h-4" /> Upload Resource
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-8">
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'courses' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    My Courses ({collections.length})
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'resources' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    Resources ({items.length})
                </button>
            </div>

            {/* COURSES VIEW */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col) => (
                        <div key={col.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:border-primary transition-colors cursor-pointer">
                            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                                <PlayCircle className="w-12 h-12 text-slate-300" />
                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    ${col.price}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 mb-1">{col.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{col.description}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{col.subject}</span>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {collections.length === 0 && !loading && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400 font-medium">No courses yet. Create your first series!</p>
                        </div>
                    )}
                </div>
            )}

            {/* RESOURCES VIEW */}
            {activeTab === 'resources' && (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                    {item.type === 'pdf' ? <FileText className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                                    <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                        <span>{item.type.toUpperCase()}</span>
                                        <span>•</span>
                                        <span>${item.price}</span>
                                        <span>•</span>
                                        <span>{item.downloads || 0} downloads</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    ))}
                    {items.length === 0 && !loading && (
                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400 font-medium">No resources uploaded.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- MODALS --- */}

            {/* Create Collection Modal */}
            {showCollectionModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in relative">
                        <h2 className="text-xl font-bold mb-4">Create New Course</h2>
                        <form onSubmit={handleCreateCollection} className="space-y-4">
                            <input name="title" placeholder="Course Title (e.g. Calculus 101)" required className="w-full px-4 py-2 border rounded-lg" />
                            <textarea name="description" placeholder="What will students learn?" required className="w-full px-4 py-2 border rounded-lg h-24" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="price" type="number" placeholder="Price ($)" required className="w-full px-4 py-2 border rounded-lg" />
                                <select name="subject" className="w-full px-4 py-2 border rounded-lg">
                                    <option>Mathematics</option>
                                    <option>Physics</option>
                                    <option>English</option>
                                    <option>Computer Science</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCollectionModal(false)} className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Create Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Resource Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in relative">
                        <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
                        <form onSubmit={handleUploadResource} className="space-y-4">
                            <input name="title" placeholder="Resource Title" required className="w-full px-4 py-2 border rounded-lg" />
                            <textarea name="description" placeholder="Description" required className="w-full px-4 py-2 border rounded-lg h-20" />

                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer relative">
                                <input type="file" name="file" required className="absolute inset-0 opacity-0 cursor-pointer" />
                                <p className="text-sm text-slate-500 font-medium">Click to select file (PDF, Video)</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <select name="type" className="w-full px-4 py-2 border rounded-lg">
                                    <option value="pdf">PDF Document</option>
                                    <option value="video">Video Lesson</option>
                                </select>
                                <input name="price" type="number" placeholder="Price ($)" defaultValue="0" required className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select name="subject" className="w-full px-4 py-2 border rounded-lg">
                                    <option>Mathematics</option>
                                    <option>Physics</option>
                                    <option>English</option>
                                    <option>Computer Science</option>
                                </select>
                                <select name="grade" className="w-full px-4 py-2 border rounded-lg">
                                    <option>High School</option>
                                    <option>University</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

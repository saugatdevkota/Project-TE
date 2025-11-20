'use client';

import { useState } from 'react';

export default function TutorProfilePage() {
    const [bio, setBio] = useState('');
    const [subjects, setSubjects] = useState('');
    const [rate, setRate] = useState('');
    const [experience, setExperience] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile saved!');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
                <p className="text-slate-600">Update your teaching details to attract more students.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">About You</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            placeholder="Tell students about your teaching style and experience..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Subjects (comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="Math, Physics, Chemistry"
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="5"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Rate ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="40.00"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">AI Suggested Rate: Based on your experience, $35-$50 is competitive.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

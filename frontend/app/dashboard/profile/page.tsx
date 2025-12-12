'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    if (!user) return <div className="p-8">Please log in.</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    {user.role === 'tutor' ? 'Edit Tutor Profile' : 'My Profile'}
                </h1>
                <p className="text-slate-600">
                    {user.role === 'tutor'
                        ? 'Update your teaching details to attract more students.'
                        : 'Manage your account settings and preferences.'}
                </p>
            </div>

            {user.role === 'tutor' ? (
                <TutorProfileForm user={user} />
            ) : (
                <StudentProfileForm user={user} />
            )}
        </div>
    );
}

function StudentProfileForm({ user }: { user: any }) {
    // For MVP, Student profile is read-only or simple layout
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-primary">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-slate-500 capitalize">{user.role}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium">
                        {user.name}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium">
                        {user.email}
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Learning Preferences</h3>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-sm text-indigo-800">
                        <strong>Tip:</strong> Your learning stats and booking history are available on your <a href="/dashboard/student" className="underline font-bold">Dashboard</a>.
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 opacity-50 cursor-not-allowed" title="Account management coming soon">
                <button className="text-slate-500 hover:text-slate-900 font-bold px-4 py-2">Change Password</button>
                <button className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold">Edit Details</button>
            </div>
        </div>
    );
}

function TutorProfileForm({ user }: { user: any }) {
    const [bio, setBio] = useState('');
    const [subjects, setSubjects] = useState('');
    const [rate, setRate] = useState('');
    const [experience, setExperience] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.get(`/tutors/${user.id}`);
                setBio(data.bio || '');
                setSubjects(Array.isArray(data.subjects) ? data.subjects.join(', ') : (data.subjects || ''));
                setRate(data.hourly_rate || '');
                setExperience(data.years_experience || '');
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s);

            await api.put(`/tutors/${user.id}`, {
                bio,
                subjects: JSON.stringify(subjectsArray),
                hourly_rate: Number(rate),
                years_experience: Number(experience)
            });

            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving profile');
        }
    };

    if (loading) return <div className="text-center py-8 text-slate-400">Loading your profile...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">About You</label>
                    <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Tell students about your teaching style and experience..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Subjects (comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Math, Physics, Chemistry"
                            value={subjects}
                            onChange={(e) => setSubjects(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="5"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Hourly Rate ($)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            type="number"
                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="40.00"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">AI Suggested Rate: Based on your experience, $35-$50 is competitive.</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-primary/20">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

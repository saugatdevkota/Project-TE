'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Camera, Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [photoLoading, setPhotoLoading] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        setLoading(false);
    }, []);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        try {
            setPhotoLoading(true);
            // 1. Upload File
            const uploadRes = await api.upload('/upload', file);

            // 2. Update User Profile in DB
            const updatedUser = await api.patch('/auth/profile', {
                profile_photo: uploadRes.url
            });

            // 3. Update Local State & Storage
            const newUser = { ...user, profile_photo: uploadRes.url };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

            // Optional: Trigger a custom event if Navbar needs to re-render immediately and doesn't listen to storage
            // For now, simpler approach is fine. Reloading page or just navigating usually updates navbar in Next.js if logic is in useEffect?
            // Navbar useEffect runs on mount. So we might need to dispatch event.
            window.dispatchEvent(new Event('storage')); // Mock storage event for same tab?

        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to update profile photo');
        } finally {
            setPhotoLoading(false);
        }
    };

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

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 mb-6 flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md">
                        {user.profile_photo ? (
                            <img src={user.profile_photo} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-primary">{user.name.charAt(0)}</span>
                        )}
                        {photoLoading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg transition-transform hover:scale-110">
                        <Camera className="w-4 h-4" />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                            disabled={photoLoading}
                        />
                    </label>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-slate-500 capitalize">{user.role}</p>
                    <p className="text-sm text-slate-400 mt-1">{user.email}</p>
                </div>
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
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Personal Information</h3>
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

            <div className="pt-6">
                <h3 className="font-bold text-slate-900 mb-4">Account</h3>
                <div className="flex justify-start gap-3 opacity-50 cursor-not-allowed">
                    <button className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold">Change Password</button>
                </div>
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
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.get(`/tutors/${user.id}`);
                setBio(data.bio || '');
                setSubjects(Array.isArray(data.subjects) ? data.subjects.join(', ') : (data.subjects || ''));
                setRate(data.hourly_rate || '');
                setExperience(data.years_experience || '');
                setIsPremium(data.is_premium || false);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.id]);

    const handlePremiumToggle = async () => {
        try {
            const res = await api.post(`/tutors/${user.id}/premium`, {});
            setIsPremium(res.is_premium);
            alert(res.is_premium ? 'Congratulations! You are now a Premium Tutor.' : 'You are no longer a Premium Tutor.');
        } catch (error) {
            console.log(error);
            alert('Failed to update premium status');
        }
    };

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
            <h3 className="font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Teaching Profile</h3>

            {/* Premium Card */}
            <div className={`p-6 rounded-xl border mb-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isPremium ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${isPremium ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                        {isPremium ? '👑' : '☆'}
                    </div>
                    <div>
                        <h4 className={`font-bold ${isPremium ? 'text-amber-900' : 'text-slate-900'}`}>
                            {isPremium ? 'You are a Premium Tutor!' : 'Go Premium & Get More Students'}
                        </h4>
                        <p className={`text-sm ${isPremium ? 'text-amber-700' : 'text-slate-500'}`}>
                            {isPremium ? 'Your profile is boosted to the top of search results.' : 'Premium tutors get 3x more views and bookings. $19/mo.'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handlePremiumToggle}
                    type="button"
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${isPremium ? 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600'}`}
                >
                    {isPremium ? 'Manage Subscription' : 'Upgrade Now'}
                </button>
            </div>

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

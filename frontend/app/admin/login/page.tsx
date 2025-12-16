'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Clear any existing user session to prevent conflicts
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Admin Auth for MVP
        if (email === 'admin@te.com' && password === 'admin123') {
            localStorage.setItem('adminToken', 'mock-admin-token');
            // FIX: Set user object so Navbar detects login
            const adminUser = {
                name: 'Administrator',
                role: 'admin',
                email: 'admin@te.com'
            };
            localStorage.setItem('user', JSON.stringify(adminUser));
            window.dispatchEvent(new Event('auth-change'));

            // Use hard navigation to ensure clean state
            window.location.href = '/admin/dashboard';
        } else {
            alert('Invalid Admin Credentials');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-indigo-200">System Management Access</p>
                </div>
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="admin@admin.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Access Dashboard
                        </button>
                    </form>
                    <div className="mt-6 text-center text-xs text-slate-400">
                        Authorized personnel only. Access is logged.
                    </div>
                </div>
            </div>
        </div>
    );
}

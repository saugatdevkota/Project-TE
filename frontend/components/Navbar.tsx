"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Initial check
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Listen for login/logout events
        const handleAuthChange = () => {
            const updatedUser = localStorage.getItem("user");
            setUser(updatedUser ? JSON.parse(updatedUser) : null);
        };

        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/login"); // Redirect to login
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            T
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-800 group-hover:text-primary transition-colors">
                            Tutor<span className="text-primary">Everywhere</span>
                        </span>
                    </Link>

                    {/* Navigation Items - Dynamic based on Role */}
                    <div className="hidden md:flex items-center gap-8">

                        {/* GUEST VIEW */}
                        {!user && (
                            <>
                                <Link href="/tutors" className="text-slate-600 hover:text-primary font-medium transition">Find a Tutor</Link>
                                <div className="h-4 w-px bg-slate-200"></div>
                                <Link href="/register?role=tutor" className="relative overflow-hidden px-6 py-2 rounded-full border border-primary text-primary group font-medium hover:border-transparent">
                                    <span className="relative z-10 group-hover:text-white transition">Become a Tutor</span>
                                    <span className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
                                </Link>
                                <Link href="/login" className="text-slate-600 hover:text-primary font-medium transition">Log in</Link>
                            </>
                        )}

                        {/* STUDENT VIEW */}
                        {user?.role === 'student' && (
                            <>
                                <Link href="/dashboard/student" className="nav-link">Search</Link>
                                <Link href="/dashboard/bookings" className="nav-link">My Sessions</Link>
                                <Link href="/dashboard/messages" className="nav-link">Messages</Link>
                                <Link href="/dashboard/wallet" className="nav-link">Wallet</Link>

                                {/* Profile Dropdown */}
                                <div className="relative ml-4">
                                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border border-slate-200 transition">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {user.name[0]}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in flex flex-col z-50">
                                            <Link href="/dashboard/profile" className="px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm block">Profile Settings</Link>
                                            <button onClick={handleLogout} className="text-left w-full px-4 py-2 hover:bg-red-50 text-red-500 text-sm font-medium">Log out</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* TUTOR VIEW */}
                        {user?.role === 'tutor' && (
                            <>
                                <Link href="/dashboard/tutor" className="nav-link">Dashboard</Link>
                                <Link href="/dashboard/tutor/content" className="nav-link">Content Hub</Link>
                                <Link href="/dashboard/bookings" className="nav-link">Sessions</Link>
                                <Link href="/dashboard/sales" className="nav-link">Earnings</Link>

                                {/* Profile Dropdown */}
                                <div className="relative ml-4">
                                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border border-slate-200 transition">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name[0]}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in flex flex-col z-50">
                                            <Link href="/dashboard/profile" className="px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm block">Tutor Profile</Link>
                                            <button onClick={handleLogout} className="text-left w-full px-4 py-2 hover:bg-red-50 text-red-500 text-sm font-medium">Log out</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>

            <style jsx>{`
        .nav-link {
            padding: 0.5rem;
            color: #475569;
            font-weight: 500;
            transition: color 0.2s;
        }
        .nav-link:hover {
            color: #FF5A5F;
        }
      `}</style>
        </nav>
    );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "./navbars/PublicNavbar";
import StudentNavbar from "./navbars/StudentNavbar";
import TutorNavbar from "./navbars/TutorNavbar";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        // Initial check
        const checkUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for login/logout events
        const handleAuthChange = () => {
            checkUser();
        };

        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, []);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [user]);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50 relative">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            T
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-800 group-hover:text-primary transition-colors">
                            Tutor<span className="text-primary">Everywhere</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        {!user ? (
                            <PublicNavbar />
                        ) : user.role === 'tutor' ? (
                            <TutorNavbar user={user} onLogout={handleLogout} />
                        ) : (
                            <StudentNavbar user={user} onLogout={handleLogout} />
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center z-50 relative">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden pt-24 px-6 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col space-y-6 text-lg font-medium text-slate-800">
                    {!user ? (
                        <>
                            <Link href="/" className="py-2 border-b border-slate-50">Home</Link>
                            <Link href="/tutors" className="py-2 border-b border-slate-50">Find a Tutor</Link>
                            <Link href="/register?role=tutor" className="py-2 text-primary">Become a Tutor</Link>
                            <Link href="/login" className="py-2">Log in</Link>
                        </>
                    ) : user.role === 'student' ? (
                        <>
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {user.name && user.name[0]}
                                </div>
                                <span>{user.name}</span>
                            </div>
                            <Link href="/dashboard/student" className="py-2">Search Tutors</Link>
                            <Link href="/dashboard/bookings" className="py-2">My Sessions</Link>
                            <Link href="/dashboard/messages" className="py-2">Messages</Link>
                            <button onClick={handleLogout} className="py-2 text-red-500 text-left">Log out</button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {user.name && user.name[0]}
                                </div>
                                <span>{user.name}</span>
                            </div>
                            <Link href="/dashboard/tutor" className="py-2">Dashboard</Link>
                            <Link href="/dashboard/bookings" className="py-2">Sessions</Link>
                            <Link href="/dashboard/tutor/content" className="py-2">Content Hub</Link>
                            <button onClick={handleLogout} className="py-2 text-red-500 text-left">Log out</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

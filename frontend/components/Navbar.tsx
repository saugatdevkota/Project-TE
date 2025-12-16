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

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken"); // Ensure deep cleanup
        setUser(null); // Clear local state immediately
        window.dispatchEvent(new Event("auth-change")); // Notify other components
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
                    {!user ? (
                        <PublicNavbar />
                    ) : user.role === 'tutor' ? (
                        <TutorNavbar user={user} onLogout={handleLogout} />
                    ) : (
                        <StudentNavbar user={user} onLogout={handleLogout} />
                    )}

                </div>
            </div>
        </nav>
    );
}

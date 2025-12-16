import Link from "next/link";
import { useState } from "react";

export default function StudentNavbar({ user, onLogout }: { user: any, onLogout: () => void }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard/student" className="nav-link">Search</Link>
            <Link href="/dashboard/bookings" className="nav-link">My Sessions</Link>
            <Link href="/dashboard/messages" className="nav-link">Messages</Link>
            <Link href="/dashboard/wallet" className="nav-link">Wallet</Link>

            {/* Profile Dropdown */}
            <div className="relative ml-4">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border border-slate-200 transition">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user.name && user.name[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in flex flex-col z-50">
                        <Link href="/dashboard/profile" className="px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm block">Profile Settings</Link>
                        <button onClick={onLogout} className="text-left w-full px-4 py-2 hover:bg-red-50 text-red-500 text-sm font-medium">Log out</button>
                    </div>
                )}
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
        </div>
    );
}

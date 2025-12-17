"use client";
import Link from "next/link";

export default function TutorHome({ user }: { user: any }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header Banner - Dark Blue - Full Width relative to the content area */}
            <div className="bg-[#0f172a] text-white py-12 px-8 rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Hello, {user.name.split(' ')[0]}!</h1>
                    <p className="text-slate-300">Manage your tutoring business.</p>

                    <div className="mt-8 flex items-center justify-end">
                        <Link href="/dashboard/tutor" className="bg-primary hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
                            My Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-[-30px] w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Earnings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Earnings (Month)</span>
                        <div className="text-3xl font-extrabold text-slate-800 mt-2">$0.00</div>
                    </div>

                    {/* New Requests */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">New Requests</span>
                        <div className="text-3xl font-extrabold text-indigo-600 mt-2">0</div>
                    </div>

                    {/* Upcoming Class */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between col-span-1 md:col-span-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Class</span>
                        <div className="text-lg font-bold text-slate-800 mt-2">No classes</div>
                    </div>

                    {/* View All */}
                    <Link href="/dashboard/tutor/requests" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 hover:shadow-md transition">
                        <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">View All Requests</span>
                        <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* Lower Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 pb-12">
                    {/* Quick Actions */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 ml-1">Quick Actions</h3>
                        <div className="space-y-4">
                            <Link href="/dashboard/profile" className="block bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition group">
                                <div className="font-bold text-slate-800 group-hover:text-indigo-700">Edit Profile</div>
                                <div className="text-sm text-slate-500">Update your bio, subjects, and rates.</div>
                            </Link>

                            <Link href="/dashboard/wallet" className="block bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition group">
                                <div className="font-bold text-slate-800 group-hover:text-indigo-700">Withdraw Earnings</div>
                                <div className="text-sm text-slate-500">Manage your payout methods.</div>
                            </Link>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div>
                        {/* Hidden Spacer/Header to align with left col if needed, or just standard spacing */}
                        <div className="h-8 md:block hidden"></div>
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mt-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">💡</span>
                                <span className="font-bold text-indigo-900">Pro Tip</span>
                            </div>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                Tutors with verified badges get 3x more bookings. Upload your documents today to get verified.
                            </p>
                            <Link href="/dashboard/tutor/verification" className="text-indigo-700 font-bold hover:underline text-sm">
                                Go to Verification →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";
import Link from "next/link";
import { Star } from 'lucide-react';

export default function StudentHome({ user, tutors }: { user: any, tutors: any[] }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header Banner - Lighter Blue for Students */}
            <div className="bg-[#4338ca] text-white py-12 px-8 rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4 shadow-lg relative overflow-hidden">
                {/* Decor Circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                    <p className="text-indigo-100">Ready to learn something new today?</p>

                    <div className="mt-8 flex items-center gap-4 flex-wrap">
                        <Link href="/dashboard/student/search" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-2 px-6 rounded-full transition-colors shadow-sm">
                            Find a Tutor
                        </Link>
                        <Link href="/dashboard/bookings" className="bg-indigo-600/50 hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-full transition-colors border border-indigo-500/50 backdrop-blur-sm">
                            My Schedule
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-[-30px] w-full pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Wallet Balance */}
                    <div className="bg-indigo-600 rounded-2xl p-6 shadow-md text-white flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <span className="text-xs font-bold text-indigo-200 uppercase tracking-wide relative z-10">Wallet Balance</span>
                        <div className="relative z-10">
                            <div className="text-3xl font-extrabold mt-2">$2000.00</div>
                            <Link href="/dashboard/wallet" className="inline-block mt-4 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors backdrop-blur-sm">
                                + Add Funds
                            </Link>
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Sessions</span>
                        <div className="text-3xl font-extrabold text-slate-800 mt-2">0</div>
                        <Link href="/dashboard/bookings" className="text-indigo-600 text-sm font-bold mt-2 hover:underline">View Schedule →</Link>
                    </div>

                    {/* Learning Hours */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Learning Hours</span>
                        <div className="text-3xl font-extrabold text-slate-800 mt-2">0.0</div>
                    </div>
                </div>

                {/* Recommended Tutors Section */}
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Recommended for you</h2>
                    <Link href="/dashboard/student/search" className="text-sm text-indigo-600 font-bold hover:underline">See all →</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tutors && tutors.length > 0 ? tutors.slice(0, 4).map((tutor: any) => (
                        <Link href={`/tutor/${tutor.tutor_id || tutor.id}`} key={tutor.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="h-40 bg-slate-100 relative overflow-hidden">
                                {tutor.profile_photo ? (
                                    <img src={tutor.profile_photo} alt={tutor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl font-bold font-mono bg-indigo-50 text-indigo-200">
                                        {tutor.name?.[0]}
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center shadow-sm">
                                    <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                                    {tutor.rating || '5.0'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 truncate">{tutor.name}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3 h-8">{tutor.bio || "Certified tutor ready to help."}</p>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                    <span className="font-bold text-indigo-600">${tutor.hourly_rate}/hr</span>
                                    <span className="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors">View Profile</span>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        // Empty State / Loading look
                        <div className="col-span-4 py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No tutors found at the moment.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

import { Link } from 'lucide-react';
import NextLink from 'next/link';

export default function TutorDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* TOP: Business Summary */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Business Snapshot</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Earnings This Month */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
                        <div className="text-slate-500 font-medium text-sm">Earnings this month</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">$1,250</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                    </div>

                    {/* New Requests */}
                    <NextLink href="/dashboard/bookings" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="text-slate-500 font-medium text-sm">New Requests</div>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">2</div>
                        <div className="text-xs text-slate-400">Waiting for response</div>
                    </NextLink>

                    {/* Upcoming Session */}
                    <NextLink href="/dashboard/bookings" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
                        <div className="text-slate-500 font-medium text-sm">Next Session</div>
                        <div>
                            <div className="font-bold text-slate-900">Physics with Sarah</div>
                            <div className="text-sm text-primary font-medium mt-1">Today, 4:00 PM</div>
                        </div>
                    </NextLink>
                </div>
            </div>

            {/* MIDDLE: Actions */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NextLink href="/dashboard/bookings" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-xl font-bold text-center transition py-4">
                        Accept Requests
                    </NextLink>
                    <NextLink href="/dashboard/messages" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 p-4 rounded-xl font-bold text-center transition py-4 shadow-sm">
                        Message Students
                    </NextLink>
                    <NextLink href="/dashboard/profile" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 p-4 rounded-xl font-bold text-center transition py-4 shadow-sm">
                        Update Availability
                    </NextLink>
                </div>
            </div>

            {/* BOTTOM: Growth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Complete your profile</h3>
                        <p className="text-slate-400 text-sm mb-4">You are 80% there! Add a video introduction to boost your visibility by 2x.</p>

                        <div className="w-full bg-slate-700 h-2 rounded-full mb-4">
                            <div className="bg-emerald-400 h-2 rounded-full w-[80%]"></div>
                        </div>

                        <NextLink href="/dashboard/profile" className="text-sm font-bold text-white underline decoration-emerald-400 decoration-2 underline-offset-4 hover:text-emerald-300">
                            Finish Setup
                        </NextLink>
                    </div>
                    {/* Abstract bg element */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-900">Pro Tip</h3>
                    </div>
                    <p className="text-slate-600 text-sm">
                        Tutors who respond to messages within 1 hour are <strong>3x more likely</strong> to get booked. Check your notifications!
                    </p>
                </div>
            </div>
        </div>
    );
}

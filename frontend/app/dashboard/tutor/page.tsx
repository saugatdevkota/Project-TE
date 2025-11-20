export default function TutorDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tutor Dashboard</h1>
                    <p className="text-slate-600">Manage your students and content.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
                        Edit Profile
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Create Content
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Total Earnings</div>
                    <div className="text-3xl font-bold text-slate-900">$1,250</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Active Students</div>
                    <div className="text-3xl font-bold text-slate-900">12</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Profile Views</div>
                    <div className="text-3xl font-bold text-slate-900">348</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Rating</div>
                    <div className="text-3xl font-bold text-slate-900">4.9</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Requests */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Booking Requests</h2>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">2 Pending</span>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                            S
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Student Name</h3>
                                            <p className="text-sm text-slate-500">Trial Session • Tomorrow, 2:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Decline</button>
                                        <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-indigo-700">Accept</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Earnings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Recent Earnings</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">Physics Lesson</p>
                                        <p className="text-sm text-slate-500">Nov 20, 2023</p>
                                    </div>
                                    <span className="font-bold text-emerald-600">+$45.00</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

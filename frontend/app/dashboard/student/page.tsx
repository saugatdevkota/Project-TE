export default function StudentDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hello, Student!</h1>
                    <p className="text-slate-600">Ready to learn something new today?</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Find a Tutor
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Upcoming Sessions</div>
                    <div className="text-3xl font-bold text-slate-900">2</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Wallet Balance</div>
                    <div className="text-3xl font-bold text-slate-900">$45.00</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Total Hours Learned</div>
                    <div className="text-3xl font-bold text-slate-900">12.5</div>
                </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Sessions</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                        JD
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Advanced React Patterns</h3>
                                        <p className="text-sm text-slate-500">with John Doe • Today, 4:00 PM</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                                    Join Call
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

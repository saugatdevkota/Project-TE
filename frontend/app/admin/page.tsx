'use client';

import { Shield, Check, X, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
                        <p className="text-slate-600">Platform overview and moderation queue.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-slate-500 text-sm font-medium mb-1">Pending Verifications</div>
                        <div className="text-3xl font-bold text-amber-500">12</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-slate-500 text-sm font-medium mb-1">Active Disputes</div>
                        <div className="text-3xl font-bold text-red-500">3</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-slate-500 text-sm font-medium mb-1">Total Revenue (This Month)</div>
                        <div className="text-3xl font-bold text-emerald-600">$12,450</div>
                    </div>
                </div>

                {/* Verification Queue */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            Verification Queue
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">New Tutor Applicant</h3>
                                        <p className="text-sm text-slate-500">Applied 2 hours ago • ID & Degree Uploaded</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Passport.pdf</span>
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Degree.pdf</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fraud Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Safety Alerts
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-lg border border-red-100">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm">Potential Off-Platform Payment Detected</h4>
                                <p className="text-sm mt-1 opacity-90">
                                    User <strong>John Doe</strong> sent a message containing "PayPal" to Tutor <strong>Sarah Smith</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

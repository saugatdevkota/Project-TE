'use client';

import { Upload, Shield, CheckCircle } from 'lucide-react';

export default function VerificationPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Get Verified</h1>
                <p className="text-slate-600">Verified tutors get 3x more bookings. Upload your documents below.</p>
            </div>

            <div className="grid gap-6">
                {/* Status Card */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-start gap-4">
                    <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-indigo-900">Verification Status: Pending</h3>
                        <p className="text-indigo-700 text-sm mt-1">
                            Please upload a government ID and your highest degree certification. Our team will review it within 24 hours.
                        </p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                    <h3 className="font-bold text-slate-900 mb-6">Upload Documents</h3>

                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-6 h-6 text-slate-500" />
                            </div>
                            <h4 className="font-medium text-slate-900">Government ID</h4>
                            <p className="text-sm text-slate-500 mt-1">Passport, Driver's License, or National ID</p>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-6 h-6 text-slate-500" />
                            </div>
                            <h4 className="font-medium text-slate-900">Degree / Certification</h4>
                            <p className="text-sm text-slate-500 mt-1">University Diploma or Teaching Certificate</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                            Submit for Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Upload, Shield, CheckCircle, FileText, Loader2 } from 'lucide-react';

export default function VerificationPage() {
    const [idFile, setIdFile] = useState<File | null>(null);
    const [certFile, setCertFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('pending'); // initial, pending, success

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'cert') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'id') setIdFile(e.target.files[0]);
            else setCertFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        return await res.json();
    };

    const handleSubmit = async () => {
        if (!idFile || !certFile) {
            alert('Please upload both documents.');
            return;
        }

        setUploading(true);
        try {
            // Upload files first
            const idRes = await uploadFile(idFile);
            const certRes = await uploadFile(certFile);

            // Then submit verification request
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                await fetch(`${API_URL}/tutors/${user.id}/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        documentUrl: [idRes.url, certRes.url] // Sending both URLs
                    })
                });

                setStatus('success');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit documents. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-xl mx-auto text-center pt-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Documents Submitted!</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    Thank you for submitting your verification documents. Our team will review them and update your status within 24 hours.
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 font-bold">What happens next?</p>
                    <p className="text-sm text-slate-500 mt-1">You will receive an email once verified.</p>
                </div>
            </div>
        );
    }

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
                        <h3 className="font-bold text-indigo-900">Verification Status: Action Required</h3>
                        <p className="text-indigo-700 text-sm mt-1">
                            Please upload a government ID and your highest degree certification.
                        </p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                    <h3 className="font-bold text-slate-900 mb-6">Upload Documents</h3>

                    <div className="space-y-6">
                        {/* ID Upload */}
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${idFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'id')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                                {idFile ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                                        <h4 className="font-bold text-emerald-900">{idFile.name}</h4>
                                        <p className="text-sm text-emerald-600">Ready to upload</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-slate-400 mb-3" />
                                        <h4 className="font-bold text-slate-900">Government ID</h4>
                                        <p className="text-sm text-slate-500 mt-1">Click to upload Passport / Driver's License</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Certificate Upload */}
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${certFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'cert')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                                {certFile ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                                        <h4 className="font-bold text-emerald-900">{certFile.name}</h4>
                                        <p className="text-sm text-emerald-600">Ready to upload</p>
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-10 h-10 text-slate-400 mb-3" />
                                        <h4 className="font-bold text-slate-900">Degree / Certification</h4>
                                        <p className="text-sm text-slate-500 mt-1">Click to upload Diploma / Certificate</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={uploading || !idFile || !certFile}
                            className={`px-8 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${uploading || !idFile || !certFile ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-indigo-700 shadow-lg'}`}
                        >
                            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {uploading ? 'Uploading...' : 'Submit for Review'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

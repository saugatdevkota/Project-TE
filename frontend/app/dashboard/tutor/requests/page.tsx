'use client';

import { useState, useEffect } from 'react';

export default function BookingRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            // Assuming getMyBookings handles filter by role=tutor
            const res = await fetch(`${API_URL}/bookings?userId=${user.id}&role=tutor`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = (id: string) => {
        alert('Booking Accepted! (Logic to update status would go here)');
        // In real app: PATCH /api/bookings/:id { status: 'confirmed' }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Lesson Requests</h1>
                <button onClick={fetchRequests} className="text-primary text-sm font-bold hover:underline">Refresh</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No new requests at the moment.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {requests.map(req => (
                            <div key={req.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                        {(req.other_party_name || 'S')[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{req.other_party_name}</h3>
                                        <p className="text-sm text-slate-600">requested a lesson</p>
                                        <div className="text-xs text-slate-400 mt-1">{new Date(req.session_time).toLocaleString()} • ${req.price}</div>
                                        <div className="mt-1 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold uppercase">{req.status}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors">
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        className="px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Accept Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

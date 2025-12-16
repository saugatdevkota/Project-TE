'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Booking {
    id: string;
    session_time: string;
    type: string;
    price: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    other_party_name: string;
    other_party_photo: string | null;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const upcomingBookings = bookings.filter(b => b.status === 'scheduled' && new Date(b.session_time) > new Date());
    const completedBookings = bookings.filter(b => b.status === 'completed' || (b.status === 'scheduled' && new Date(b.session_time) <= new Date())); // Assuming past scheduled are completed or pending completion
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    const displayedBookings = activeTab === 'upcoming'
        ? upcomingBookings
        : activeTab === 'completed'
            ? completedBookings
            : cancelledBookings;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
                    <p className="text-slate-600">Manage your upcoming sessions and view past lessons.</p>
                </div>
                <Link href="/tutors" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-primary/20 text-center">
                    Book New Lesson
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'upcoming' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Upcoming ({upcomingBookings.length})
                    {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'completed' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Completed ({completedBookings.length})
                    {activeTab === 'completed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'cancelled' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Cancelled ({cancelledBookings.length})
                    {activeTab === 'cancelled' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : displayedBookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No {activeTab} bookings</h3>
                    <p className="text-slate-500 mb-6">You don't have any {activeTab} sessions at the moment.</p>
                    {activeTab === 'upcoming' && (
                        <Link href="/tutors" className="text-primary font-bold hover:underline">
                            Browse Tutors
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedBookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
                            {/* Date Box */}
                            <div className="flex-shrink-0 w-full md:w-20 bg-indigo-50 rounded-lg p-3 text-center flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-indigo-400 uppercase">{format(new Date(booking.session_time), 'MMM')}</span>
                                <span className="text-2xl font-bold text-indigo-700">{format(new Date(booking.session_time), 'd')}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{booking.other_party_name}</h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {format(new Date(booking.session_time), 'h:mm a')}
                                    </div>
                                    <div className="flex items-center gap-1.5 capitalize">
                                        <Video className="w-4 h-4" />
                                        {booking.type} Lesson
                                    </div>
                                </div>
                            </div>

                            {/* Status/Action */}
                            <div className="flex-shrink-0">
                                {activeTab === 'upcoming' ? (
                                    <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Join Meeting
                                    </button>
                                ) : activeTab === 'completed' ? (
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg">
                                        <CheckCircle className="w-5 h-5" />
                                        Completed
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-rose-500 font-medium bg-rose-50 px-4 py-2 rounded-lg">
                                        <XCircle className="w-5 h-5" />
                                        Cancelled
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

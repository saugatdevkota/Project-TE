'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [tutor, setTutor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Mock Calendar Slots
    const slots = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

    // Fetch Tutor Details
    useEffect(() => {
        const fetchTutor = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/tutors/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setTutor(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchTutor();
    }, [id]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) return alert('Please select a date and time');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (!userStr || !token) {
                alert('Please login to book a lesson');
                router.push('/login');
                return;
            }
            const user = JSON.parse(userStr);

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tutorId: id,
                    studentId: user.id,
                    sessionTime: `${selectedDate} ${selectedTime}`,
                    type: 'trial',
                    price: tutor.hourly_rate
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Booking Confirmed! Redirecting to Dashboard...');
                router.push('/dashboard/student');
            } else {
                alert(data.message || 'Booking failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!tutor) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Confirm Your Lesson</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tutor Details Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-700">
                                {tutor.name[0]}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{tutor.name}</h2>
                                <p className="text-slate-500">{tutor.subjects && JSON.parse(tutor.subjects)[0]}</p>
                            </div>
                        </div>
                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Hourly Rate</span>
                                <span className="font-bold text-slate-900">${tutor.hourly_rate}/hr</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-500">
                                <span>Platform Fee</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">
                                <span>Total</span>
                                <span>${tutor.hourly_rate}.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Scheduling & Payment */}
                    <div className="space-y-6">
                        {/* 1. Date & Time */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Select a Time</h3>
                            <input
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4 outline-none focus:ring-2 focus:ring-primary"
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                {slots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-2 rounded-lg font-medium border ${selectedTime === time ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl"
                        >
                            {loading ? 'Processing...' : `Confirm & Pay $${tutor.hourly_rate}`}
                        </button>
                        <p className="text-center text-xs text-slate-400">Payment held in escrow until lesson is complete.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

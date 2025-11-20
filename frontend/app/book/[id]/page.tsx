'use client';

import { useState } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';

export default function BookingPage({ params }: { params: { id: string } }) {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const handleBooking = () => {
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 p-8 text-white">
                        <h1 className="text-2xl font-bold">Book a Session</h1>
                        <p className="text-indigo-100"> Sarah Smith</p>
                    </div>

                    <div className="p-8">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-8 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                        </div>

                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900">Select Date & Time</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">Pick a Date</label>
                                        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
                                            <Calendar className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                                            <p className="text-slate-500">Calendar Component Placeholder</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">Available Slots</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'].map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedTime === time
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-600'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-6">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!selectedTime}
                                        className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900">Confirm & Pay</h2>

                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Session Fee (1 hr)</span>
                                        <span className="font-medium text-slate-900">$45.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Service Fee</span>
                                        <span className="font-medium text-slate-900">$2.50</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>$47.50</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 px-6 py-3 rounded-xl font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Pay Securely
                                    </button>
                                </div>
                                <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Funds held in escrow until session completes
                                </p>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                                <p className="text-slate-600 mb-8">You have successfully booked a session with Sarah.</p>
                                <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { ShieldCheck } from 'lucide-react';

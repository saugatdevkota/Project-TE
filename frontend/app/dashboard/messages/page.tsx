'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Paperclip, Phone, Calendar, Send, Video, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null); // Current User

    // UI States
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    }, []);

    // Mock user for conversation list (in real app, fetch "my contacts" based on bookings)
    const contacts = [
        { id: 1, name: "Dr. Sarah Wilson", lastMessage: "See you tomorrow!", time: "10:30 AM" },
        { id: 2, name: "Platform Support", lastMessage: "How can we help?", time: "Yesterday" }
    ];

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        // Optimistic update
        const newMsg = { id: Date.now(), text: messageInput, sender_id: user.id, msg_type: 'text', timestamp: new Date().toISOString() };
        setMessages([...messages, newMsg]);
        setMessageInput('');

        // TODO: In real implementation, emit socket event or call API
    };

    const handleCreateOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const offerData = {
            tutorId: user.id,
            studentId: selectedChat.id, // Assuming selectedChat has the ID of the other user
            subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
            price: Number((form.elements.namedItem('price') as HTMLInputElement).value),
            sessionCount: Number((form.elements.namedItem('sessions') as HTMLInputElement).value),
            description: (form.elements.namedItem('description') as HTMLTextAreaElement).value
        };

        setIsSending(true);
        try {
            const res = await api.post('/offers', offerData);
            setShowOfferModal(false);

            // Add offer message to chat optimistically (or fetch from response)
            // Ideally backend returns the formatted message object to append
            // For now, let's mock the update or re-fetch messages
            alert('Offer sent!');
        } catch (err) {
            alert('Failed to send offer');
        } finally {
            setIsSending(false);
        }
    };

    const handleRespondToOffer = async (offerId: string, status: 'accepted' | 'rejected') => {
        try {
            await api.post(`/offers/${offerId}/respond`, { status, studentId: user.id });
            // Update local message state to reflect change (e.g., set metadata.status = status)
            setMessages(prev => prev.map(m => {
                if (m.metadata?.offerId === offerId) {
                    return { ...m, metadata: { ...m.metadata, status } };
                }
                return m;
            }));
        } catch (err) {
            alert('Failed to respond to offer');
        }
    };

    const renderMessage = (msg: any) => {
        const isMe = msg.sender_id === user?.id; // Check against current user ID

        // 1. OFFER BUBBLE
        if (msg.msg_type === 'offer' && msg.metadata) {
            const meta = typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata;
            const isPending = meta.status === 'pending';

            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                    <div className={`rounded-2xl p-4 shadow-sm border max-w-sm ${isMe ? 'bg-white border-primary/30' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-dashed border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase">Custom Offer</span>
                                <h4 className="font-bold text-slate-900 text-sm">{meta.subject}</h4>
                            </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-3">
                            {msg.text || "I have prepared a custom lesson plan for you."}
                        </p>

                        <div className="bg-slate-50 p-3 rounded-xl mb-4 text-sm">
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-500">Price</span>
                                <span className="font-bold text-slate-900">${meta.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Sessions</span>
                                <span className="font-bold text-slate-900">{meta.sessionCount}x</span>
                            </div>
                        </div>

                        {/* STATUS BUTTONS */}
                        {isPending ? (
                            isMe ? (
                                <div className="text-xs text-center text-slate-400 font-medium bg-slate-50 py-2 rounded-lg">
                                    Waiting for response...
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRespondToOffer(meta.offerId, 'rejected')}
                                        className="flex-1 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleRespondToOffer(meta.offerId, 'accepted')}
                                        className="flex-1 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-600 rounded-lg transition shadow-md shadow-primary/20"
                                    >
                                        Accept Offer
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className={`text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${meta.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {meta.status === 'accepted' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                Offer {meta.status.charAt(0).toUpperCase() + meta.status.slice(1)}
                            </div>
                        )}

                    </div>
                </div>
            )
        }

        // 2. SYSTEM MESSAGE
        if (msg.msg_type === 'system') {
            return (
                <div key={msg.id} className="flex justify-center my-4">
                    <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full font-medium">
                        {msg.text || msg.content}
                    </span>
                </div>
            )
        }

        // 3. TEXT MESSAGE
        return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-xs shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                    {msg.text || msg.content}
                    {msg.attachments && (typeof msg.attachments === 'string' ? JSON.parse(msg.attachments) : msg.attachments).map((url: string, idx: number) => (
                        <div key={idx} className="mt-2 p-2 bg-black/10 rounded-lg">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
                                <Paperclip className="w-3 h-3" /> Attachment {idx + 1}
                            </a>
                        </div>
                    ))}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[calc(100vh-140px)] flex overflow-hidden">
            {/* Sidebar (Contacts) */}
            <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedChat(contact)}
                            className={`p-4 hover:bg-white cursor-pointer transition-colors border-b border-slate-100/50 ${selectedChat?.id === contact.id ? 'bg-white border-l-4 border-l-primary' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-slate-900 text-sm">{contact.name}</h3>
                                <span className="text-xs text-slate-400">{contact.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{contact.lastMessage}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col bg-white relative">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold">
                                    {selectedChat.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{selectedChat.name}</h3>
                                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">● Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {user?.role === 'tutor' && (
                                    <button onClick={() => setShowOfferModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors text-xs mr-2 border border-slate-700 shadow-sm">
                                        <DollarSign className="w-3 h-3" />
                                        Create Offer
                                    </button>
                                )}
                                <Link href={`/book/${selectedChat.id}`} className="flex items-center gap-2 bg-indigo-50 text-primary px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors text-xs ml-2">
                                    <Calendar className="w-3 h-3" />
                                    Book Session
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {/* Render Messages */}
                            {messages.map(renderMessage)}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 text-slate-400 hover:text-primary transition-colors"
                                    title="Attach File"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" />
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 transition-all"
                                />
                                <button type="submit" disabled={isSending} className="bg-primary text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        {/* CREATE OFFER MODAL */}
                        {showOfferModal && (
                            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100 transition-transform">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                                            <div className="p-1 bg-green-100 text-green-600 rounded-full"><DollarSign className="w-4 h-4" /></div>
                                            Send Custom Offer
                                        </h3>
                                        <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
                                    </div>

                                    <form onSubmit={handleCreateOffer}>
                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subject</label>
                                                <input name="subject" defaultValue="Custom Session" className="w-full px-3 py-2 border rounded-lg text-sm font-medium" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Price ($)</label>
                                                    <input name="price" type="number" defaultValue="50" className="w-full px-3 py-2 border rounded-lg text-sm font-medium" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Sessions</label>
                                                    <input name="sessionCount" type="number" defaultValue="1" className="w-full px-3 py-2 border rounded-lg text-sm font-medium" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Details</label>
                                                <textarea name="description" placeholder="Briefly describe what this offer covers..." className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none font-medium text-slate-600"></textarea>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={isSending} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition shadow-lg shadow-primary/20 flex justify-center">
                                            {isSending ? 'Sending...' : 'Send Offer'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">💬</div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

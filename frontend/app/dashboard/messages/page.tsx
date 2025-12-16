'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Paperclip, Phone, Calendar, Send, Video } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);

    // Mock user for conversation list (in real app, fetch "my contacts" based on bookings)
    const contacts = [
        { id: 1, name: "Dr. Sarah Wilson", lastMessage: "See you tomorrow!", time: "10:30 AM" },
        { id: 2, name: "Platform Support", lastMessage: "How can we help?", time: "Yesterday" }
    ];

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        // Optimistic update
        const newMsg = { id: Date.now(), text: messageInput, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages([...messages, newMsg]);
        setMessageInput('');

        // Mock Socket Emit
        // socket.emit('send_message', { text: messageInput, ... })
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        try {
            const res = await api.upload('/upload', e.target.files[0]);
            // Send message with attachment
            // In real app: socket.emit('send_message', { text: 'Sent a file', attachments: [res.url] })
            setMessages([...messages, {
                id: Date.now(),
                text: `Sent a file: ${res.filename}`,
                sender: 'me',
                time: "Just now",
                attachments: [res.url]
            }]);
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
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
            <div className="w-2/3 flex flex-col bg-white">
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
                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors" title="Start Video Call">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors" title="Voice Call">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <Link href={`/book/${selectedChat.id}`} className="flex items-center gap-2 bg-indigo-50 text-primary px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors text-sm ml-2">
                                    <Calendar className="w-4 h-4" />
                                    Book Session
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {/* History Mock */}
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-xs shadow-sm">
                                    {selectedChat.lastMessage}
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-2xl max-w-xs shadow-sm ${msg.sender === 'me' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                                        {msg.text}
                                        {msg.attachments && msg.attachments.map((url: string, idx: number) => (
                                            <div key={idx} className="mt-2 p-2 bg-black/10 rounded-lg">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
                                                    <Paperclip className="w-3 h-3" /> Attachment {idx + 1}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                                </div>
                            ))}
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
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 transition-all"
                                />
                                <button type="submit" disabled={uploading} className="bg-primary text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
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

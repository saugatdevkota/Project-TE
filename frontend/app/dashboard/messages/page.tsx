'use client';

import { useState, useEffect } from 'react';

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);

    // Mock user for conversation list (in real app, fetch "my contacts" based on bookings)
    const contacts = [
        { id: 1, name: "Dr. Sarah Wilson", lastMessage: "See you tomorrow!", time: "10:30 AM" },
        { id: 2, name: "Platform Support", lastMessage: "How can we help?", time: "Yesterday" }
    ];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        // Optimistic update
        setMessages([...messages, { id: Date.now(), text: messageInput, sender: 'me', time: 'Now' }]);
        setMessageInput('');

        // In real app: POST /api/chat/send
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
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <h3 className="font-bold text-slate-900">{selectedChat.name}</h3>
                            <button className="text-slate-400 hover:text-primary">•••</button>
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
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 transition-all"
                                />
                                <button type="submit" className="bg-primary text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                    </svg>
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

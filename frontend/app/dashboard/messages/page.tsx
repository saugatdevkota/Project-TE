'use client';

import { useState, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
// import io from 'socket.io-client';

// Mock data for UI
const mockConversations = [
    { id: 1, name: 'Sarah Smith', lastMessage: 'See you tomorrow!', time: '10:30 AM', unread: 2, avatar: 'bg-emerald-100 text-emerald-600' },
    { id: 2, name: 'John Doe', lastMessage: 'Thanks for the lesson.', time: 'Yesterday', unread: 0, avatar: 'bg-indigo-100 text-indigo-600' },
];

const mockMessages = [
    { id: 1, sender: 'them', text: 'Hi! I am interested in your calculus lessons.', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hello! I would be happy to help. What specific topics are you struggling with?', time: '10:05 AM' },
    { id: 3, sender: 'them', text: 'Mostly derivatives and integrals.', time: '10:10 AM' },
    { id: 4, sender: 'me', text: 'Great, those are my specialties. Shall we book a trial?', time: '10:12 AM' },
    { id: 5, sender: 'them', text: 'Yes, that sounds perfect!', time: '10:15 AM' },
];

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState<number | null>(1);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState(mockMessages);

    // In real app:
    // useEffect(() => {
    //   const socket = io('http://localhost:5000');
    //   socket.emit('join_chat', currentUserId);
    //   socket.on('receive_message', (msg) => setMessages(prev => [...prev, msg]));
    //   return () => socket.disconnect();
    // }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessageInput('');
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-100 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {mockConversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${activeChat === chat.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${chat.avatar}`}>
                                {chat.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-slate-900 truncate">{chat.name}</h3>
                                    <span className="text-xs text-slate-400">{chat.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                            S
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Sarah Smith</h3>
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'me'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-slate-900 border border-slate-100 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

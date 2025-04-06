"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
const mockChats = [
    {
        id: 1,
        name: "Mai Anh",
        photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        lastMessage: "Tối nay đi cà phê không?",
        time: "5 min ago",
        unread: 2,
    },
    {
        id: 2,
        name: "Hoàng Minh",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        lastMessage: "Rất vui được gặp bạn hôm qua!",
        time: "2 hours ago",
        unread: 0,
    },
    {
        id: 3,
        name: "Thu Hà",
        photo: "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        lastMessage: "Bạn thích đọc sách gì?",
        time: "Yesterday",
        unread: 0,
    },
];
const ChatListPage = () => {
    const router = useRouter();
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col h-screen bg-gray-50">
                <header className="bg-white p-4 shadow-sm">
                    <h1 className="text-xl font-bold text-[#FF5864] mb-4">
                        Messages
                    </h1>
                    <div className="relative">
                        <SearchIcon
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                        />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {mockChats.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {mockChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() =>
                                        router.push(`/chat/${chat.id}`)
                                    }
                                    className="flex items-center p-4 bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="relative">
                                        <img
                                            src={chat.photo}
                                            alt={chat.name}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        {chat.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5864] rounded-full flex items-center justify-center">
                                                <span className="text-xs text-white">
                                                    {chat.unread}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-gray-800">
                                                {chat.name}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {chat.time}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm ${
                                                chat.unread > 0
                                                    ? "font-semibold text-gray-800"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <MessageSquareIcon
                                    size={40}
                                    className="text-gray-400"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                No messages yet
                            </h2>
                            <p className="text-gray-600">
                                Start matching with people to begin
                                conversations
                            </p>
                        </div>
                    )}
                </main>
                <BottomNavigation activeTab="chats" />
            </div>
        </div>
    );
};
export default ChatListPage;

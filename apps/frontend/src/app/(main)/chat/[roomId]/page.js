"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, SendIcon, ImageIcon, SmileIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock data for the chat
const mockChatData = {
    1: {
        id: 1,
        name: "Mai Anh",
        photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        messages: [
            {
                id: 1,
                text: "Chào bạn! Rất vui được kết nối với bạn.",
                sender: "them",
                time: "10:30 AM",
            },
            {
                id: 2,
                text: "Chào bạn! Mình cũng vậy. Bạn thích đi cà phê không?",
                sender: "me",
                time: "10:32 AM",
            },
            {
                id: 3,
                text: "Có chứ, mình rất thích cà phê. Bạn có đề xuất quán nào không?",
                sender: "them",
                time: "10:35 AM",
            },
            {
                id: 4,
                text: "Mình biết một quán cà phê nhỏ ở quận 1, view rất đẹp.",
                sender: "me",
                time: "10:36 AM",
            },
            {
                id: 5,
                text: "Nghe hay đấy! Tối nay đi cà phê không?",
                sender: "them",
                time: "10:40 AM",
            },
        ],
    },
    2: {
        id: 2,
        name: "Hoàng Minh",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        messages: [
            {
                id: 1,
                text: "Rất vui được gặp bạn hôm qua!",
                sender: "them",
                time: "4:15 PM",
            },
            {
                id: 2,
                text: "Mình cũng vậy! Buổi gặp mặt rất thú vị.",
                sender: "me",
                time: "4:20 PM",
            },
        ],
    },
    3: {
        id: 3,
        name: "Thu Hà",
        photo: "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        messages: [
            {
                id: 1,
                text: "Chào bạn, profile của bạn rất thú vị!",
                sender: "me",
                time: "Yesterday",
            },
            {
                id: 2,
                text: "Cảm ơn bạn! Mình thấy bạn cũng thích đọc sách.",
                sender: "them",
                time: "Yesterday",
            },
            {
                id: 3,
                text: "Bạn thích đọc sách gì?",
                sender: "them",
                time: "Yesterday",
            },
        ],
    },
};
// AI-generated icebreaker questions
const icebreakers = [
    "Nếu có thể đi du lịch bất cứ đâu, bạn sẽ chọn nơi nào?",
    "Bộ phim yêu thích của bạn là gì?",
    "Bữa ăn ngon nhất bạn từng có là gì?",
    "Hoạt động cuối tuần lý tưởng của bạn là gì?",
];
const ChatPage = () => {
    const auth = useAuth();

    const params = useParams();
    const id = params.roomId; // Next.js dynamic route parameter
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState(null);
    const [showIcebreakers, setShowIcebreakers] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const fetchChatData = async () => {
            if (!id) return;
            const response = await fetch(
                `http://localhost:3001/api/messages/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth?.auth?.access_token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch chat data");
            }
            const data = await response.json();
            setChat(data);
        };
        fetchChatData();
        setChat(mockChatData[id]);
    }, [id]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chat?.messages]);
    const handleSend = () => {
        if (message.trim() === "") return;
        const newMessage = {
            id: chat.messages.length + 1,
            text: message,
            sender: "me",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        setChat({
            ...chat,
            messages: [...chat.messages, newMessage],
        });
        setMessage("");
    };
    const handleIcebreakerSelect = (question) => {
        setMessage(question);
        setShowIcebreakers(false);
    };
    if (!chat) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white p-4 shadow-sm flex items-center">
                <button onClick={() => navigate("/chats")} className="mr-3">
                    <ArrowLeftIcon size={24} className="text-gray-500" />
                </button>
                <img
                    src={chat.photo}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                    <h1 className="font-semibold text-gray-800">{chat.name}</h1>
                    <p className="text-xs text-gray-500">Online</p>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {chat.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.sender === "me"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 
                  ${
                      msg.sender === "me"
                          ? "bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                            >
                                <p>{msg.text}</p>
                                <p
                                    className={`text-xs ${
                                        msg.sender === "me"
                                            ? "text-white/70"
                                            : "text-gray-500"
                                    } text-right mt-1`}
                                >
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            {showIcebreakers && (
                <div className="bg-white border-t border-gray-200 p-3">
                    <p className="text-sm text-gray-600 mb-2">
                        AI Icebreakers:
                    </p>
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                        {icebreakers.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleIcebreakerSelect(question)}
                                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm whitespace-nowrap"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="bg-white border-t border-gray-200 p-3">
                <div className="flex items-center">
                    <button className="p-2 text-gray-500">
                        <ImageIcon size={24} />
                    </button>
                    <div className="flex-1 mx-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSend()
                            }
                        />
                    </div>
                    {message.trim() === "" ? (
                        <button
                            onClick={() => setShowIcebreakers(!showIcebreakers)}
                            className="p-2 text-gray-500"
                        >
                            <SmileIcon size={24} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            className="p-2 text-[#FF5864]"
                        >
                            <SendIcon size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ChatPage;

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, SendIcon, ImageIcon, SmileIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { getRelativeTime } from "@/utils/Time";
import { useSocket } from "@/hooks/useSocket";

// AI-generated icebreaker questions
const icebreakers = [
    "Nếu có thể đi du lịch bất cứ đâu, bạn sẽ chọn nơi nào?",
    "Bộ phim yêu thích của bạn là gì?",
    "Bữa ăn ngon nhất bạn từng có là gì?",
    "Hoạt động cuối tuần lý tưởng của bạn là gì?",
];
const MessagePage = () => {
    const auth = useAuth();
    const socket = useSocket();

    const params = useParams();
    const id = params.matchId;

    const router = useRouter();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState(null);
    const [showIcebreakers, setShowIcebreakers] = useState(false);
    const messagesEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchChatData = async () => {
        if (!id) {
            showToast.error("Có lỗi xảy ra");
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:3001/api/messages/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth?.auth?.access_token}`,
                    },
                }
            );
            const data = await response.json();

            setChat(data?.data);
        } catch (error) {}
    };
    useEffect(() => {
        fetchChatData();
    }, [id]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chat?.messages]);
    useEffect(() => {
        if (!socket) return;
        socket.on("receive-new-message", () => {
            fetchChatData();
        });
        return () => {
            socket.off("reveive-new-message", (message) => {});
        };
    }, [socket]);
    const handleSend = async () => {
        if (message.trim() === "") return;
        const newMessage = {
            content: message,
            senderId: auth?.auth?.user?.id,
            receiverId: chat?.id,
            sent_at: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            matchId: parseInt(id),
        };
        try {
            const response = await fetch(`http://localhost:3001/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth?.auth?.access_token}`,
                },
                body: JSON.stringify(newMessage),
            });
            const data = await response.json();
            socket.emit("new-message", newMessage);
            fetchChatData();
        } catch (error) {
            showToast.error("Có lỗi xảy ra");
        }

        setMessage("");
    };
    const handleIcebreakerSelect = (question) => {
        setMessage(question);
        setShowIcebreakers(false);
    };
    if (!chat) {
        return (
            <div className="flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    console.log(chat);

    return (
        <div className="flex flex-col h-[70vh] w-[50vh] bg-gray-50">
            <header className="flex items-center p-4 bg-white shadow-sm">
                <button
                    onClick={() => router.push("/matches")}
                    className="mr-3"
                >
                    <ArrowLeftIcon size={24} className="text-gray-500" />
                </button>
                <img
                    src={
                        chat?.photo?.url?.[0] === "/"
                            ? `http://localhost:3001${chat?.photo?.url}`
                            : "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg"
                    }
                    alt={chat?.name}
                    className="object-cover w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                    <h1 className="font-semibold text-gray-800">
                        {chat?.name}
                    </h1>
                    {/* <p className="text-xs text-gray-500">Online</p> */}
                </div>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {chat?.messages?.map((msg) => (
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
                                    {getRelativeTime(msg.time)}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            {showIcebreakers && (
                <div className="p-3 bg-white border-t border-gray-200">
                    <p className="mb-2 text-sm text-gray-600">
                        AI Icebreakers:
                    </p>
                    <div className="flex pb-2 space-x-2 overflow-x-auto">
                        {icebreakers.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleIcebreakerSelect(question)}
                                className="px-3 py-2 text-sm text-gray-800 bg-gray-100 rounded-full whitespace-nowrap"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="p-3 bg-white border-t border-gray-200">
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
export default MessagePage;

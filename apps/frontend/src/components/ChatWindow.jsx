// src/components/ChatWindow.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getSocket } from "@/lib/socket";

export default function ChatWindow({ matchId, user }) {
    console.log(user);

    const router = useRouter();
    const [match, setMatch] = useState();
    console.log(match);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const socket = getSocket();

    useEffect(() => {
        socket.on("receive-message", (message) => {
            console.log(message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.off("receive-message");
        };
    }, []);

    useEffect(() => {
        socket.emit("me", user);
        return () => {
            socket.off("me");
        };
    }, [user]);

    useEffect(() => {
        const getMatch = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/auth/login");
                return;
            }
            try {
                const res = await axios.get(
                    `http://localhost:3001/api/rooms/${matchId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setMatch(res.data.room);
            } catch (err) {
                if (err.response.status === 403) {
                    router.push("/auth/login");
                    return;
                }
                console.error("Failed to load match", err);
            }
        };
        getMatch();
        // Fetch message history
        const fetchMessages = async () => {
            if (!matchId) return;
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/auth/login");
                    return;
                }
                const res = await axios(
                    `http://localhost:3001/api/messages?match_id=${matchId}`
                );
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to load messages", err);
                // router.push("/auth/login");
            }
        };
        fetchMessages();
    }, [matchId]);

    useEffect(() => {
        const handleReceive = (message) => {
            if (message.match_id === matchId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on("receiveMessage", handleReceive);
        return () => {
            socket.off("receiveMessage", handleReceive);
        };
    }, [matchId, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim()) return;
        const data = {
            sender_id: user.id,
            receiver_id:
                match?.user_2_id === user.id
                    ? match?.user_1_id
                    : match?.user_2_id,
            match_id: matchId,
            content: message,
        };
        console.log(data);

        socket.emit("send-message", data);
        setMessage("");
    };

    return (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            👤
                        </div>
                        <div className="text-white">
                            <p className="font-medium">
                                {match?.user_match_1?.id === user?.id
                                    ? match?.user_match_2?.display_name
                                    : match?.user_match_1?.display_name}
                            </p>
                            {/* <p className="text-xs text-white/70">
                                Room ID: {matchId}
                            </p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm text-white/90">Online</span>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 h-[600px] overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-4">
                        {/* Message Bubble */}
                        <div
                            className={`flex flex-col ${
                                msg.sender?.id === user.id
                                    ? "items-end"
                                    : "items-start"
                            }`}
                        >
                            {/* User Name */}
                            {/* <span className="text-xs text-gray-500 mb-1 px-2">
                                {msg.sender?.id !== user.id
                                    ? msg.sender?.display_name
                                    : ""}
                            </span> */}

                            {/* Message Content */}
                            <div
                                className={`p-3 rounded-xl max-w-[70%] break-words ${
                                    msg.sender?.id === user.id
                                        ? "bg-blue-500 text-white rounded-tr-none"
                                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>

                            {/* Timestamp */}
                            <span className="text-xs text-gray-400 mt-1 px-2">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 
                                 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center"
                    >
                        <span>Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

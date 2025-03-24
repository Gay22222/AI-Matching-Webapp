// src/components/ChatWindow.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSocket } from "@/lib/socket"; // dùng socket singleton

export default function ChatWindow({ matchId, userId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const socket = getSocket(); // 🔁 luôn chỉ dùng 1 socket duy nhất

    useEffect(() => {
        // Fetch message history
        const fetchMessages = async () => {
            if (!matchId) return;
            try {
                const res = await axios(
                    `http://localhost:3001/api/messages?match_id=${matchId}`
                );
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to load messages", err);
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
        if (!input.trim()) return;
        const message = {
            sender_id: userId,
            receiver_id: 2, // giả định
            match_id: matchId,
            content: input,
        };
        socket.emit("sendMessage", message);
        setInput("");
    };

    return (
        <div className="w-full max-w-md border rounded-xl shadow p-4 flex flex-col gap-4">
            <div className="flex-1 h-96 overflow-y-auto border p-2 rounded bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-2 p-2 rounded-lg max-w-[75%] text-sm ${
                            msg.sender_id === userId
                                ? "bg-blue-200 ml-auto"
                                : "bg-gray-300 mr-auto"
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-1"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

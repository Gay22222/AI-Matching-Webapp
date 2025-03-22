// src/components/ChatWindow.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // socket server backend

export default function ChatWindow({ matchId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch message history
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages?match_id=${matchId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [matchId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (message.match_id === matchId) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const message = {
      sender_id: userId,
      receiver_id: 2, // giả định receiver là user 2, bạn có thể dynamic sau
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
              msg.sender_id === userId ? "bg-blue-200 ml-auto" : "bg-gray-300 mr-auto"
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
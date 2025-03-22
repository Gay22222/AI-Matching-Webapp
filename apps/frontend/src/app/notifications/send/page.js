"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function SendNotificationPage() {
  const [recipientId, setRecipientId] = useState(2);
  const [senderId, setSenderId] = useState(1);
  const [type, setType] = useState("match");
  const [content, setContent] = useState("💬 Bạn đã được match!");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected for sender:", socket.id);
    });
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    socket.emit("sendNotification", {
      recipient_id: Number(recipientId),
      sender_id: Number(senderId),
      type,
      content,
    });
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">📤 Gửi thông báo qua WebSocket</h1>

      <form onSubmit={handleSend} className="space-y-4">
        <input
          type="number"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          placeholder="Người nhận ID"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          placeholder="Người gửi ID"
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="match">Match</option>
          <option value="like">Like</option>
          <option value="message">Tin nhắn</option>
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nội dung thông báo"
          className="w-full border p-2 rounded"
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Gửi thông báo
        </button>
      </form>
    </main>
  );
}

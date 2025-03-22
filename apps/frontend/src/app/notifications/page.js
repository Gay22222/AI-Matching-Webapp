"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // kết nối WebSocket

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const userId = Number(searchParams.get("userId")) || null;

  const [notifications, setNotifications] = useState([]);

  // fetch notifications lần đầu
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${userId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
    }
  };

  // đánh dấu đã đọc
  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      fetchNotifications();
    } catch (err) {
      console.error("Không thể đánh dấu đã đọc:", err);
    }
  };

  // WebSocket setup
  useEffect(() => {
    if (!userId) return;
  
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
      socket.emit("joinUser", userId);
      console.log(" Đã join room: user:" + userId);
    });
  
    fetchNotifications();
  
    socket.on("receiveNotification", (notification) => {
      console.log(" Nhận notification realtime:", notification);
      if (notification.recipient_id === userId) {
        setNotifications((prev) => [notification, ...prev]);
      }
    });
  
    return () => {
      socket.off("receiveNotification");
      socket.off("connect");
    };
  }, [userId]);
  


  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔔 Thông báo của bạn</h1>
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-3 border rounded cursor-pointer ${
              n.is_read ? "bg-gray-100" : "bg-yellow-100 font-semibold"
            }`}
          >
            <div>{n.content}</div>
            <small className="text-sm text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
}

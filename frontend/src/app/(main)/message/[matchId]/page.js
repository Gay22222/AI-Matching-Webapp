"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, SendIcon, SmileIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { getRelativeTime } from "@/utils/Time";
import { useSocket } from "@/hooks/useSocket";

const icebreakers = [
  "Nếu có thể đi du lịch bất cứ đâu, bạn sẽ chọn nơi nào?",
  "Bộ phim yêu thích của bạn là gì?",
  "Bữa ăn ngon nhất bạn từng có là gì?",
  "Hoạt động cuối tuần lý tưởng của bạn là gì?",
];

const MessagePage = () => {
  const { auth, currentUser } = useAuth();
  const socket = useSocket();
  const params = useParams();
  const id = params.matchId;
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!auth?.access_token) {
      console.warn("No access token, redirecting to login");
      showToast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/auth/login");
    }
  }, [auth, router]);

  const fetchChatData = async () => {
    if (!id) {
      setError("Thiếu matchId");
      showToast.error("Có lỗi xảy ra: Thiếu matchId");
      return;
    }
    if (!auth?.access_token) {
      setError("Chưa đăng nhập");
      showToast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/auth/login");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3001/api/message/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        }
        if (response.status === 403) {
          throw new Error("Bạn không có quyền truy cập cuộc trò chuyện này");
        }
        throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setChat(data.data);
      console.log("Chat data:", JSON.stringify(data.data, null, 2));
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setError(error.message);
      showToast.error(`Lỗi tải tin nhắn: ${error.message}`);
      if (error.message.includes("đăng nhập")) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [id, auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-new-message", (message) => {
      console.log("New message received:", message);
      fetchChatData();
    });
    return () => {
      socket.off("receive-new-message");
    };
  }, [socket]);

  const handleSend = async () => {
    if (message.trim() === "") return;
    if (!chat?.id) {
      showToast.error("Không thể gửi tin nhắn: Cuộc trò chuyện chưa được khởi tạo");
      return;
    }
    const newMessage = {
      content: message,
      receiverId: chat.id,
      matchId: parseInt(id),
    };
    console.log("Sending message:", JSON.stringify(newMessage, null, 2)); // Debug
    try {
      const response = await fetch(`http://localhost:3001/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify(newMessage),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.message || `Lỗi API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      socket.emit("new-message", {
        id: data.data.id,
        text: data.data.text,
        time: data.data.time,
        sender: parseInt(data.data.sender_id) === parseInt(currentUser?.id) ? "me" : "other",
        sender_id: currentUser?.id,
        receiverId: newMessage.receiverId,
        matchId: newMessage.matchId,
      });
      fetchChatData();
    } catch (error) {
      console.error("Error sending message:", error);
      showToast.error(`Lỗi gửi tin nhắn: ${error.message}`);
    }
    setMessage("");
  };

  const handleIcebreakerSelect = (question) => {
    setMessage(question);
    setShowIcebreakers(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/matches")}
          className="mt-4 px-6 py-2 bg-[#FF5864] text-white rounded-xl hover:bg-[#FF655B]"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-sm">
        <button onClick={() => router.push("/matches")} className="mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center">
          <div className="ml-2">
            <p className="font-semibold text-gray-900 text-lg">{chat?.name || "Người dùng"}</p>
          </div>
        </div>
      </div>

      {/* Khung chat */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {chat?.messages?.length > 0 ? (
          chat.messages.map((msg) => {
            const isMe = parseInt(msg.sender_id) === parseInt(currentUser?.id);
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-md p-4 rounded-2xl text-base ${
                    isMe ? "bg-[#FF5864] text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getRelativeTime(msg.time)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 text-base">Chưa có tin nhắn nào</p>
            <button
              onClick={() => setShowIcebreakers(true)}
              className="mt-4 px-6 py-2 bg-[#FF5864] text-white rounded-xl hover:bg-[#FF655B]"
            >
              Gợi ý câu hỏi
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Icebreaker suggestions */}
      {showIcebreakers && (
        <div className="p-4 bg-white border-t border-gray-200">
          <p className="font-medium text-gray-700 mb-2">Gợi ý câu hỏi:</p>
          <div className="flex flex-wrap gap-2">
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

      {/* Input nhập tin nhắn */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent text-base"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          {message.trim() === "" ? (
            <button
              onClick={() => setShowIcebreakers(!showIcebreakers)}
              className="p-2 text-gray-500 hover:text-[#FF5864]"
            >
              <SmileIcon className="w-6 h-6" />
            </button>
          ) : (
            <button onClick={handleSend} className="p-2 text-[#FF5864] hover:text-[#FF655B]">
              <SendIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Media queries cho responsive */}
      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 80% !important;
          }
          .max-w-3xl {
            max-width: 100% !important;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .text-base {
            font-size: 0.875rem !important;
          }
          .text-lg {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MessagePage;
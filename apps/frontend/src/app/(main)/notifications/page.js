"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { HeartIcon, MessageCircleIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { getRelativeTime } from "@/utils/Time";
import { useSocket } from "@/hooks/useSocket";

const getNotificationContent = (notification) => {
    switch (notification.type) {
        case "NEW_MATCH":
            return {
                icon: <HeartIcon className="h-5 w-5 text-[#FF5864]" />,
                text: `Bạn và ${notification.user.name} đã ghép đôi!`,
                link: "/matches",
            };
        case "LIKED":
            return {
                icon: <HeartIcon className="h-5 w-5 text-[#FF5864]" />,
                text: `${notification.user.name} đã thích bạn`,
                link: "/matches",
                type: "like",
            };
        default:
            return null;
    }
};

export default function NotificationsPage() {
    const socket = useSocket();

    const auth = useAuth();

    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/notifications", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth?.auth?.access_token}`,
                },
            });
            const data = await res.json();
            console.log(data);

            setNotifications(data?.data || []);
        } catch (error) {}
    };
    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("new-notification", (notifications = []) => {
            console.log("Received new notification:", notifications);
            fetchNotifications();
        });
    }, [socket]);

    const handleAccept = async (e, matchId, notificationId) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Accepted notification:");
        try {
            const res = await fetch(
                `http://localhost:3001/api/matches/${matchId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth?.auth?.access_token}`,
                    },
                    body: JSON.stringify({
                        isAccept: true,
                        notificationId,
                    }),
                }
            );
            const data = await res?.json();

            socket.emit("accept-match", data?.match);

            fetchNotifications();
        } catch (error) {}
    };

    return (
        <div className="w-full max-w-lg mx-auto ">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden min-h-[70vh]">
                <div className="p-4 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800">
                        Thông báo
                    </h1>
                </div>
                <div className="divide-y divide-gray-100">
                    {notifications?.map((notification) => {
                        const content = getNotificationContent(notification);
                        return (
                            <Link
                                key={notification?.id}
                                href={content?.link}
                                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors
                         ${!notification?.read ? "bg-pink-50/50" : ""}`}
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            notification?.user?.photo?.[0]
                                                ?.url?.[0] === "/"
                                                ? notification?.user?.photo?.[0]
                                                      ?.url
                                                : "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg"
                                        }
                                        alt={notification?.user.name}
                                        className="object-cover w-12 h-12 rounded-full"
                                    />
                                    <div className="absolute p-1 bg-white rounded-full -bottom-1 -right-1">
                                        {content.icon}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">
                                        {content.text}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {getRelativeTime(notification?.time)}
                                    </p>
                                    {notification?.type === "LIKED" && (
                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            <button
                                                className="w-full btn btn-primary rounded-lg transition-all duration-300
                        bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white p-2 cursor-pointer"
                                                onClick={(e) =>
                                                    handleAccept(
                                                        e,
                                                        notification?.matchId,
                                                        notification?.id
                                                    )
                                                }
                                            >
                                                Accept
                                            </button>
                                            <button className="w-full p-2 transition-all duration-300 border border-gray-300 rounded-lg cursor-pointer btn btn-primary hover:bg-gray-100">
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {!notification?.read && (
                                    <div className="w-2 h-2 bg-[#FF5864] rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
                {notifications?.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        <p>Không có thông báo mới</p>
                    </div>
                )}
            </div>
        </div>
    );
}

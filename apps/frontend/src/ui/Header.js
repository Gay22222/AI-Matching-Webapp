"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FlameIcon, SettingsIcon, BellIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";

import NotificationDropdown from "./NotificationDropdown";
const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const auth = useAuth();
    const socket = useSocket();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/notifications", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth?.auth?.access_token}`,
                },
            });
            const data = await res.json();
            const unread = data?.data?.filter(
                (notification) => !notification.read
            ).length;
            setUnreadCount(unread);
            setNotifications(data?.data || []);
        } catch (error) {}
    };
    useEffect(() => {
        fetchNotifications();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.on("new-notification", () => {
            console.log("Received new notification:");
            fetchNotifications();
        });
    }, [socket]);
    return (
        <header className="sticky top-0 z-10 shadow-sm bg-white/80 backdrop-blur-md">
            <div className="container flex items-center justify-between px-4 py-3 mx-auto">
                <Link
                    href="/"
                    className="flex items-center transition-transform duration-300 group hover:scale-105"
                >
                    <FlameIcon className="h-6 w-6 text-[#FF5864]" />
                    <span className="ml-2 text-2xl font-bold text-transparent bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text">
                        DateViet
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300
                     hover:shadow-md active:scale-95 relative"
                        >
                            <BellIcon className="w-6 h-6 text-gray-600" />
                            {unreadCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5864] text-white text-xs
                             rounded-full flex items-center justify-center animate-pulse"
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <NotificationDropdown
                                notifications={notifications}
                                onClose={() => setShowNotifications(false)}
                            />
                        )}
                    </div>
                    <Link
                        href="/settings"
                        className="p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300
                   hover:shadow-md active:scale-95"
                    >
                        <SettingsIcon className="w-6 h-6 text-gray-600" />
                    </Link>
                </div>
            </div>
        </header>
    );
};
export default Header;

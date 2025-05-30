"use client";

import { setupAxios } from "@/app/auth/_helpers";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

setupAxios(axios);
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth, currentUser } = useAuth();
    const socket = useSocket();

    const fetchNotifications = async () => {
        if (!auth?.access_token) {
            console.log("No access token found, skipping notification fetch.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const fetchData = async () => {
                const res = await axios.get(
                    "http://localhost:3001/api/notifications",
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.access_token}`,
                        },
                    }
                );
                setNotifications(res?.data?.data || []);
            };
            fetchData();
        } catch (err) {
            console.error("Failed to fetch notification in Provider:", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [auth]);

    useEffect(() => {
        if (!socket) return;
        socket.on("new-notification", () => {
            console.log("Received new notification:");
            fetchNotifications();
        });
    }, [socket]);

    const value = useMemo(
        () => ({
            notifications,
            isLoading,
            error,
            fetchNotifications,
        }),
        [notifications, isLoading, error, fetchNotifications]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;
        const newSocket = io("http://localhost:3001", {
            autoConnect: false,
            reconnection: true,
        });

        newSocket.connect();

        newSocket.emit("me", currentUser);

        setSocket(newSocket);

        return () => newSocket.close();
    }, [currentUser]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    // if (!context) {
    //     throw new Error("useSocket must be used within a SocketProvider");
    // }
    return context;
};

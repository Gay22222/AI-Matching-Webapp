"use client";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { useEffect, useState } from "react";

export default function ChatPage() {
    const params = useParams();
    const [user, setUser] = useState({});
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const roomId = params.roomId;
    console.log(roomId, user);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <div className="bg-white shadow">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        💬 Chat Room
                    </h1>
                    <a
                        href="/dashboard"
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Dashboard
                    </a>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="p-4">
                    <ChatWindow matchId={roomId} user={user} />
                </div>
            </div>
        </main>
    );
}

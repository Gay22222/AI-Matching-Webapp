"use client";

import React from "react";

import { useRouter } from "next/navigation";

const Matches = () => {
    const router = useRouter();

    // Mock data - in a real app, this would come from an API
    const matches = [
        {
            id: "1",
            name: "Linh",
            age: 25,
            matchTime: "Hôm nay",
            photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            unread: true,
        },
        {
            id: "2",
            name: "Hương",
            age: 23,
            matchTime: "Hôm qua",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
            unread: false,
        },
    ];
    const handleMatchClick = (matchId) => {
        router.push(`/chat/${matchId}`);
    };
    return (
        <div className="w-full max-w-md mx-auto py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800">
                        Kết nối mới
                    </h1>
                </div>
                <div className="divide-y divide-gray-100">
                    {matches.map((match) => (
                        <button
                            key={match.id}
                            onClick={() => handleMatchClick(match.id)}
                            className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={match.photo}
                                    alt={match.name}
                                    className="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                {match.unread && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5864] rounded-full border-2 border-white animate-pulse"></div>
                                )}
                            </div>
                            <div className="ml-4 flex-grow text-left">
                                <div className="flex justify-between">
                                    <h2 className="font-medium text-gray-800">
                                        {match.name}, {match.age}
                                    </h2>
                                    <span className="text-sm text-gray-500">
                                        {match.matchTime}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {match.unread
                                        ? "Bạn có kết nối mới!"
                                        : "Đã kết nối"}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Matches;

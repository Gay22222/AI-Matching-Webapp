"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import Loading from "@/components/Loading";

const Matches = () => {
    const router = useRouter();
    const [matches, setMatches] = useState([]);
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    console.log(matches);

    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:3001/api/matches",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${auth?.auth?.access_token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setMatches(data?.data);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
            setIsLoading(false);
        };
        fetchMatches();
    }, []);

    const handleMatchClick = (matchId) => {
        router.push(`/message/${matchId}`);
    };
    return (
        <div className="w-full max-w-md mx-auto py-4">
            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-white rounded-lg shadow-sm  max-h-[70vh] overflow-auto">
                    <div className="p-4 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-800">
                            Kết nối mới
                        </h1>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {matches?.map?.((match) => (
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
            )}
        </div>
    );
};
export default Matches;

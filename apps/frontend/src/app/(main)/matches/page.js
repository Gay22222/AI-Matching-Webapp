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
                    console.log("Network response was not ok");
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
        <div className="w-full max-w-md py-4 mx-auto">
            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-white rounded-lg shadow-sm  max-h-[70vh] min-h-[60vh] overflow-auto">
                    <div className="p-4 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-800">
                            Kết nối mới
                        </h1>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {matches?.length > 0 ? (
                            matches?.map?.((match) => (
                                <button
                                    key={match.id}
                                    onClick={() => handleMatchClick(match.id)}
                                    className="flex items-center w-full p-4 transition-colors duration-300 hover:bg-gray-50"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                match?.photo?.url?.[0] === "/"
                                                    ? `http://localhost:3001${match?.photo?.url}`
                                                    : "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg"
                                            }
                                            alt={match.name}
                                            className="object-cover w-16 h-16 transition-transform duration-300 rounded-full hover:scale-105"
                                        />
                                        {match.unread && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5864] rounded-full border-2 border-white animate-pulse"></div>
                                        )}
                                    </div>
                                    <div className="flex-grow ml-4 text-left">
                                        <div className="flex justify-between">
                                            <h2 className="font-medium text-gray-800">
                                                {match.name}
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
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Không có kết nối nào
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default Matches;

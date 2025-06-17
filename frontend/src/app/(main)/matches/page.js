"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

const Matches = () => {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const { auth, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Hàm chuẩn hóa URL ảnh
  const normalizePhotoUrl = (photo) => {
    if (!photo) {
      console.warn("Photo URL is missing", { photo });
      return "/default-avatar.jpg";
    }
    return photo.startsWith("http") ? photo : `http://localhost:3001${photo.toLowerCase()}`;
  };

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Auth data:", JSON.stringify(auth, null, 2));
        console.log("Current user:", currentUser?.id);
        if (!auth?.access_token) {
          throw new Error("No access token available");
        }
        const response = await fetch("http://localhost:3001/api/match", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Network response was not ok:", {
            status: response.status,
            message: errorData.message,
          });
          throw new Error(errorData.message || `HTTP error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Matches data from API:", JSON.stringify(data?.data, null, 2));
        setMatches(data?.data || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setError(error.message);
        if (error.message.includes("token") || error.message.includes("401")) {
          router.push("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, [router]);

  useEffect(() => {
    console.log("Current matches state:", JSON.stringify(matches, null, 2));
  }, [matches]);

  const handleMatchClick = (matchId) => {
    router.push(`/message/${matchId}`);
  };

  return (
    <div className="w-full max-w-md py-4 mx-auto">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          Lỗi: {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-[#FF5864] text-white rounded-lg"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm max-h-[70vh] min-h-[60vh] overflow-auto">
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">Kết nối mới</h1>
          </div>
          <div className="divide-y divide-gray-100">
            {matches?.length > 0 ? (
              matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => handleMatchClick(match.id)}
                  className="flex items-center w-full p-4 transition-colors duration-300 hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={normalizePhotoUrl(match?.photo)}
                      alt={match.name || "User"}
                      className="object-cover w-16 h-16 transition-transform duration-300 rounded-full hover:scale-105"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                        e.target.src = "/default-avatar.jpg";
                      }}
                    />
                    {match.unread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5864] rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-grow ml-4 text-left">
                    <div className="flex justify-between">
                      <h2 className="font-medium text-gray-800">
                        {match.name || "Không có tên"}
                      </h2>
                      <span className="text-sm text-gray-500">{match.matchTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {match.unread ? "Bạn có kết nối mới!" : "Đã kết nối"}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">Không có kết nối nào</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
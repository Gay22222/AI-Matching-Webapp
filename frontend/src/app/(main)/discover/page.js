"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { setupAxios } from "@/app/auth/_helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { SparklesIcon, SlidersIcon } from "lucide-react";
import ProfileCard from "@/components/cards/ProfileCard";
import ProfileDetail from "@/components/cards/ProfileDetail";
import MatchModal from "@/ui/MatchModal";
import FilterModal from "@/ui/FilterModal";
import { useMetadata } from "@/hooks/useMetadata";
import { showToast } from "@/lib/toast";
import { useSocket } from "@/hooks/useSocket";

setupAxios(axios);

const DiscoverPage = () => {
    const { auth, currentUser } = useAuth();
    const socket = useSocket();
    const router = useRouter();
    const searchParams = useSearchParams();
    const metadata = useMetadata();
    const [recommendations, setRecommendations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
        initialFilters[key] = value;
    }
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        if (!auth?.access_token) {
            console.error("No access token available, redirecting to login");
            router.push("/auth/login");
            return;
        }

        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== "") {
                        params.append(key, value.trim());
                    }
                });
                const queryString = params.toString();
                const url = queryString
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/ai/recommendations?${queryString}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/api/ai/recommendations`;

                console.log("Fetching recommendations with URL:", url);
                console.log("Auth token:", auth.access_token);
                console.log("Filters:", filters);

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                    },
                });

                console.log("Response data:", JSON.stringify(response.data, null, 2));
                const recs = Array.isArray(response.data.data) ? response.data.data.slice(0, 20) : [];
                setRecommendations(recs.map(rec => ({
                    id: rec.recommendedUserId,
                    displayName: rec.recommendedUser?.display_name || "N/A",
                    name: rec.recommendedUser?.Bio?.name || "N/A",
                    age: rec.recommendedUser?.Bio?.age || "N/A",
                    aboutMe: rec.recommendedUser?.Bio?.about_me || "",
                    photos: rec.recommendedUser?.Bio?.Photo || [],
                    location: rec.recommendedUser?.Bio?.main_inf?.location || "N/A",
                    distance: rec.recommendedUser?.Bio?.main_inf?.location || "N/A",
                    tags: rec.recommendedUser?.user_favorites?.map(f => f.favorite?.name).filter(Boolean) || [],
                })));
                setCurrentIndex(0);
                if (recs.length === 0) {
                    setError("Không tìm thấy gợi ý phù hợp với bộ lọc hiện tại.");
                }
            } catch (err) {
                console.error("Error fetching recommendations:", {
                    message: err.message,
                    response: JSON.stringify(err.response?.data, null, 2),
                    status: err.response?.status,
                });
                let errorMessage = err.response?.data?.message || "Không thể tải danh sách gợi ý";
                if (err.response?.status === 404) {
                    errorMessage = "API không tồn tại. Vui lòng kiểm tra backend.";
                } else if (err.response?.status === 401) {
                    console.warn("Unauthorized, redirecting to login");
                    router.push("/auth/login");
                    return;
                } else if (err.response?.status === 500) {
                    errorMessage = "Lỗi server. Vui lòng thử lại sau.";
                } else if (!err.response) {
                    errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra mạng.";
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [auth?.access_token, filters, router]);

    useEffect(() => {
        if (!socket) return;
        socket.on("new-match", (profile) => {
            setMatchedProfile(profile);
            setShowMatch(true);
        });
        return () => socket.off("new-match");
    }, [socket]);

    const handleApplyFilters = useCallback(
        (newFilters = filters) => {
            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                    params.append(key, value);
                }
            });
            const queryString = params.toString();
            const newUrl = queryString ? `/discover?${queryString}` : "/discover";

            console.log("Updating URL to:", newUrl);
            router.push(newUrl, { scroll: false });
            setFilters(newFilters);
            setShowFilters(false);
        },
        [router]
    );

    const handleNext = useCallback(() => {
        console.log("handleNext called, currentIndex:", currentIndex, "recommendations.length:", recommendations.length);
        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex, recommendations.length]);

    const handleMatch = async (userId, callback) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/match`,
                {
                    receiverId: userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.access_token}`,
                    },
                }
            );

            setTimeout(() => {
                showToast.success("Đã thích!");
                callback && callback();
                handleNext();
            }, 1000);
        } catch (error) {
            console.error("Error matching:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setTimeout(() => {
                callback && callback();
                showToast.error(error.response?.data?.message || "Lỗi khi thích");
                handleNext();
            }, 500);
        }
    };

    const handleCloseMatch = () => {
        setShowMatch(false);
    };

    const handleAIMatch = () => {
        console.log("Refreshing /discover");
        router.push("/discover");
    };

    const handlePremium = () => {
        console.log("Navigating to premium page");
        router.push("/premium");
    };

    const handleSelectProfile = async (profile) => {
        console.log("Selected profile:", profile.id);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${profile.id}`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });
            console.log("Profile detail response:", JSON.stringify(response.data, null, 2));
            setSelectedProfile(response.data.user);
        } catch (err) {
            console.error("Error fetching profile detail:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            showToast.error("Không thể tải thông tin chi tiết người dùng");
        }
    };

    const handleBack = () => {
        console.log("Back to recommendation list");
        setSelectedProfile(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
                <div className="w-16 h-16 border-4 border-t-transparent border-[#FF5864] rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-gray-700">Đang tải danh sách gợi ý...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen gap-6 px-4">
                <h2 className="text-2xl font-bold text-gray-800">Lỗi tải dữ liệu</h2>
                <p className="text-lg text-gray-600">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        setFilters({});
                        handleApplyFilters({});
                    }}
                    className="bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen gap-6 px-4">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy gợi ý phù hợp</h2>
                <p className="text-lg text-gray-600">Hãy thử mở rộng bộ lọc hoặc làm mới gợi ý AI!</p>
                <button
                    onClick={handleAIMatch}
                    className="bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                    Làm mới gợi ý AI
                </button>
                <button
                    onClick={() => {
                        setFilters({});
                        handleApplyFilters({});
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
                >
                    Xóa bộ lọc
                </button>
            </div>
        );
    }

    if (currentIndex >= recommendations.length) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen gap-6 px-4">
                <h2 className="text-2xl font-bold text-gray-800">Đã hết người trong hôm nay</h2>
                <p className="text-lg text-gray-600">Quay lại vào ngày mai hoặc nâng cấp Premium để xem thêm!</p>
                <button
                    onClick={handlePremium}
                    className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                    Nâng cấp Premium
                </button>
                <button
                    onClick={() => {
                        setCurrentIndex(0);
                        setFilters({});
                        handleApplyFilters({});
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
                >
                    Xem lại từ đầu
                </button>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center justify-center w-full min-h-screen gap-6 px-4">
            <button
                onClick={handleAIMatch}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 bg-gradient-to-r from-[#FF5864] to-[#FF655B] rounded-xl hover:shadow-md active:scale-95"
            >
                <SparklesIcon className="w-5 h-5" />
                Làm mới gợi ý AI
            </button>
            <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md active:scale-95"
            >
                <SlidersIcon className="w-5 h-5" />
                Bộ lọc
                {Object.keys(filters).length > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                        {Object.keys(filters).length}
                    </span>
                )}
            </button>
            {selectedProfile ? (
                <ProfileDetail
                    profile={selectedProfile}
                    onBack={handleBack}
                />
            ) : (
                recommendations.length > 0 && currentIndex < recommendations.length && (
                    <ProfileCard
                        profile={recommendations[currentIndex]}
                        onHandleMatch={handleMatch}
                        onHandleNext={handleNext}
                        onSelectProfile={handleSelectProfile}
                    />
                )
            )}
            {showMatch && matchedProfile && (
                <MatchModal me={currentUser} profile={matchedProfile} onClose={handleCloseMatch} />
            )}
            <FilterModal
                metadata={metadata.metadata}
                filtersData={filters}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                onHandleFilter={(filters) => {
                    setFilters({ ...filters });
                    handleApplyFilters(filters);
                }}
            />
        </div>
    );
};

export default DiscoverPage;

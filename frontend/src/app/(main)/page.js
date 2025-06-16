"use client";

import React, { useCallback, useEffect, useState } from "react";
import MatchModal from "@/ui/MatchModal";
import ProfileCard from "@/components/cards/ProfileCard";
import ProfileDetail from "@/components/cards/ProfileDetail";
import { SlidersIcon, SparklesIcon } from "lucide-react";
import FilterModal from "@/ui/FilterModal";
import axios from "axios";
import { useMetadata } from "@/hooks/useMetadata";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";
import { useSocket } from "@/hooks/useSocket";

const Home = () => {
    const { auth, currentUser } = useAuth();
    const socket = useSocket();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { metadata } = useMetadata();
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm chuẩn hóa URL ảnh
    const normalizePhotoUrl = (url) => {
        if (!url) {
            console.warn("Photo URL is empty, using default avatar");
            return "/default-avatar.jpg";
        }
        if (url.startsWith("http")) {
            return url;
        }
        let cleanUrl = url.replace(/^\/*uploads\/*/i, "");
        cleanUrl = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
        const finalUrl = `http://localhost:3001/uploads${cleanUrl.toLowerCase()}`;
        console.debug(`Normalized photo URL: ${finalUrl}`);
        return finalUrl;
    };

    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
        initialFilters[key] = value;
    }
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        if (!auth?.access_token) {
            console.warn("No access token available, redirecting to login");
            router.push("/auth/login");
            return;
        }

        const fetchProfileSetupData = async () => {
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== "") {
                        params.append(key, value.trim());
                    }
                });
                if (currentUser?.id) {
                    params.append("currentUserId", currentUser.id);
                }
                const queryString = params.toString();
                const url = queryString
                    ? `http://localhost:3001/api/user/list-match?${queryString}`
                    : `http://localhost:3001/api/user/list-match`;

                console.log("Fetching profiles with URL:", url);
                console.log("Auth token:", auth.access_token);
                console.log("Filters:", filters);

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                    },
                });

                console.log("Response data:", JSON.stringify(response.data, null, 2));
                const users = Array.isArray(response.data.users)
                    ? response.data.users.map(user => ({
                          ...user,
                          distance: user.location || "N/A",
                          tags: user.favorites?.map(favId => {
                              const fav = metadata?.favorites?.find(f => f.id === favId);
                              return fav?.value || "";
                          }).filter(Boolean) || [],
                          photos: Array.isArray(user.photos)
                              ? user.photos.map(photo => ({
                                    ...photo,
                                    url: normalizePhotoUrl(photo.url),
                                }))
                              : [],
                      }))
                    : [];
                console.log("Profiles:", JSON.stringify(users, null, 2));
                setProfiles(users);
                setCurrentIndex(0);
                if (users.length === 0) {
                    setError("Không tìm thấy người dùng phù hợp với bộ lọc hiện tại.");
                }
            } catch (error) {
                console.error("Error fetching profiles:", {
                    message: error.message,
                    response: error.response ? {
                        data: error.response.data,
                        status: error.response.status,
                        headers: error.response.headers,
                    } : null,
                    status: error.response?.status,
                    stack: error.stack,
                });
                let errorMessage = error.response?.data?.message || "Không thể tải danh sách người dùng";
                if (error.response?.status === 404) {
                    errorMessage = "API không tồn tại. Vui lòng kiểm tra backend hoặc liên hệ hỗ trợ.";
                } else if (error.response?.status === 401) {
                    console.warn("Unauthorized, redirecting to login");
                    router.push("/auth/login");
                    return;
                } else if (error.response?.status === 500) {
                    errorMessage = "Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.";
                } else if (!error.response) {
                    errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileSetupData();
    }, [auth?.access_token, filters, currentUser?.id, router, metadata]);

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
            const newUrl = queryString ? `/?${queryString}` : "/";

            console.log("Updating URL to:", newUrl);
            router.push(newUrl, { scroll: false });
            setFilters(newFilters);
            setShowFilters(false);
        },
        [router]
    );

    const handleNext = useCallback(() => {
        console.log("handleNext called, currentIndex:", currentIndex, "profiles.length:", profiles.length);
        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex, profiles.length]);

    const handleMatch = async (userId, callback) => {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/match",
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
        console.log("Navigating to /discover");
        router.push("/discover");
    };

    const handlePremium = () => {
        console.log("Navigating to premium page");
        router.push("/premium");
    };

    const handleSelectProfile = (profile) => {
        console.log("Selected profile:", profile.id);
        setSelectedProfile(profile);
    };

    const handleBack = () => {
        console.log("Back to profile list");
        setSelectedProfile(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FF5864]"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Lỗi tải dữ liệu</h2>
                <p className="text-gray-600">{error}</p>
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

    if (!profiles || profiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy người dùng phù hợp</h2>
                <p className="text-gray-600">Hãy thử mở rộng bộ lọc hoặc thử ghép cặp AI!</p>
                <button
                    onClick={handleAIMatch}
                    className="bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                    Ghép cặp cùng AI
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

    if (currentIndex >= profiles.length) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Đã hết người trong hôm nay</h2>
                <p className="text-gray-600">Quay lại vào ngày mai hoặc nâng cấp Premium để xem thêm!</p>
                <button
                    onClick={handlePremium}
                    className="bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
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
        <div className="flex flex-col items-center justify-between min-h-screen p-4 w-full max-w-md mx-auto">
            <button
                onClick={handleAIMatch}
                className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-gradient-to-r from-[#FF5864] to-[#FF655B] rounded-xl hover:shadow-md transition-all duration-300"
            >
                <SparklesIcon className="w-5 h-5" />
                Ghép cặp cùng AI
            </button>
            <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md active:scale-95"
            >
                <SlidersIcon className="w-5 h-5" />
                Bộ lọc
                {Object.keys(filters).length > 0 && (
                    <span className="bg-[#FF5864] text-white text-xs rounded-full px-2 py-1">{Object.keys(filters).length}</span>
                )}
            </button>
            <div className="w-full max-w-sm">
                {selectedProfile ? (
                    <ProfileDetail profile={selectedProfile} onBack={handleBack} />
                ) : (
                    profiles.length > 0 && currentIndex < profiles.length && (
                        <ProfileCard
                            profile={profiles[currentIndex]}
                            onHandleMatch={handleMatch}
                            onHandleNext={handleNext}
                            onSelectProfile={handleSelectProfile}
                        />
                    )
                )}
            </div>
            {showMatch && matchedProfile && (
                <MatchModal me={currentUser} profile={matchedProfile} onClose={handleCloseMatch} />
            )}
            <FilterModal
                metadata={metadata}
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

export default Home;
"use client";
import React, { useCallback, useEffect, useState } from "react";
import MatchModal from "@/ui/MatchModal";
import ProfileCard from "@/components/cards/ProfileCard";
import { SlidersIcon } from "lucide-react";
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
    const metadata = useMetadata();
    const [profileSetupData, setProfileSetupData] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
        initialFilters[key] = value;
    }
    const [filters, setFilters] = useState(initialFilters);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchProfileSetupData = async () => {
            try {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== "") {
                        params.append(key, value);
                    }
                });
                const queryString = params.toString();
                const url = queryString
                    ? `http://localhost:3001/api/user/list-match?${queryString}`
                    : `http://localhost:3001/api/user/list-match`;

                console.log("Fetching profiles with URL:", url);
                const response = await axios.get(url);
                console.log("Response data:", response.data.users);

                setProfiles(response.data.users);
            } catch (error) {
                console.error("Error fetching profiles:", error);
            }
        };

        fetchProfileSetupData();
    }, [filters]);

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
            setShowFilters(false);
        },
        [router]
    );

    const handleNext = useCallback(() => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, profiles.length]);

    const handleMatch = async (userId, callback) => {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/matches",
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
                if (currentIndex < profiles.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                }
            }, 1000);
        } catch (error) {
            console.error(error?.response?.data?.message || "Lỗi khi matching");
            setTimeout(() => {
                callback && callback();
                showToast.error(
                    error?.response?.data?.message || "Lỗi khi matching"
                );
                if (currentIndex < profiles.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                }
            }, 500);
        } finally {
        }
    };

    const handleCloseMatch = () => {
        setShowMatch(false);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on("new-match", (profile) => {
            setMatchedProfile(profile);
            setShowMatch(true);
        });
    }, [socket]);

    if (currentIndex >= profiles.length) {
        return (
            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-4 text-center px-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Đã hết người dùng trong khu vực của bạn
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Hãy thử mở rộng bán kính tìm kiếm hoặc quay lại sau nhé!
                    </p>
                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setProfiles([]);
                            setFilters({});
                            handleApplyFilters({});
                        }}
                        className="bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white px-6 py-3 rounded-xl
                     font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Xem lại từ đầu
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-4">
            <div className="w-full flex justify-end mb-4 px-4">
                <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50
                   border border-gray-200 text-gray-700 transition-all duration-300
                   hover:shadow-md active:scale-95"
                >
                    <SlidersIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Bộ lọc</span>
                    {Object.keys(filters).length > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center bg-[#FF5864] text-white text-xs rounded-full">
                            {Object.keys(filters).length}
                        </span>
                    )}
                </button>
            </div>
            <ProfileCard
                key={profiles[currentIndex].id}
                profile={profiles[currentIndex]}
                onHandleMatch={handleMatch}
                onHandleNext={handleNext}
            />

            {showMatch && matchedProfile && (
                <MatchModal
                    profile={matchedProfile}
                    onClose={handleCloseMatch}
                />
            )}
            <FilterModal
                metadata={metadata?.metadata}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filtersData={filters}
                onHandleFilter={(filters) => {
                    setFilters({ ...filters });
                    handleApplyFilters(filters);
                    setShowFilters(false);
                }}
            />
        </div>
    );
};
export default Home;

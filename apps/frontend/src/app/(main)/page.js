"use client";
import React, { useCallback, useEffect, useState } from "react";
import MatchModal from "@/ui/MatchModal";
import ProfileCard from "@/components/cards/ProfileCard";
import { SlidersIcon } from "lucide-react";
import FilterModal from "@/ui/FilterModal";
import axios from "axios";

const Home = () => {
    const [profileSetupData, setProfileSetupData] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({});
    const profiles = [
        {
            id: "1",
            name: "Linh",
            age: 25,
            bio: "Yêu du lịch, đam mê nhiếp ảnh và thích thưởng thức cà phê vào buổi sáng. Đang tìm người có thể cùng khám phá những quán cafe mới.",
            distance: 5,
            matchPercentage: 85,
            photos: [
                "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
            ],
            tags: ["#CafeTối", "#DuLịchBụi", "#Nhiếp ảnh"],
        },
        {
            id: "2",
            name: "Hương",
            age: 23,
            bio: "Người yêu nghệ thuật và âm nhạc. Thích khám phá những nhà hàng mới và nấu ăn cho bạn bè.",
            distance: 3,
            matchPercentage: 92,
            photos: [
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
            ],
            tags: ["#Nghệ thuật", "#Nấu ăn", "#Âm nhạc"],
        },
        {
            id: "3",
            name: "Mai",
            age: 24,
            bio: "Yêu thiên nhiên và các hoạt động ngoài trời. Thích leo núi và cắm trại vào cuối tuần.",
            distance: 7,
            matchPercentage: 88,
            photos: [
                "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80",
            ],
            tags: ["#Leo núi", "#Cắm trại", "#Yoga"],
        },
    ];

    console.log(profileSetupData);

    useEffect(() => {
        const fetchProfileSetupData = async () => {
            axios
                .get("http://localhost:3001/api/profile-setup")
                .then((response) => {
                    console.log(response);

                    setProfileSetupData(response.data.data);
                })
                .catch((error) => {
                    console.error("Error fetching profile setup data:", error);
                });
        };
        fetchProfileSetupData();
    }, []);

    const handleSwipeLeft = useCallback(() => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, profiles.length]);
    const handleSwipeRight = useCallback(() => {
        const isMatch = Math.random() < 0.7;
        if (isMatch) {
            setMatchedProfile(profiles[currentIndex]);
            setShowMatch(true);
        }
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, profiles]);
    const handleSuperLike = useCallback(() => {
        const isMatch = Math.random() < 0.9;
        if (isMatch) {
            setMatchedProfile(profiles[currentIndex]);
            setShowMatch(true);
        }
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, profiles]);
    const handleCloseMatch = () => {
        setShowMatch(false);
    };
    const handleFilterChange = (filterId, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterId]: value,
        }));
    };
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
                        onClick={() => setCurrentIndex(0)}
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
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSuperLike={handleSuperLike}
            />
            <div className="mt-6 flex items-center gap-2">
                {profiles.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                                ? "w-6 bg-[#FF5864]"
                                : idx < currentIndex
                                ? "w-2 bg-gray-300"
                                : "w-2 bg-gray-200"
                        }`}
                    />
                ))}
            </div>
            {showMatch && matchedProfile && (
                <MatchModal
                    profile={matchedProfile}
                    onClose={handleCloseMatch}
                />
            )}
            <FilterModal
                data={profileSetupData}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onFilterChange={handleFilterChange}
            />
        </div>
    );
};
export default Home;

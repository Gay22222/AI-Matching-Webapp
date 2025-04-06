"use client";
import React, { useState, useRef } from "react";
import {
    HeartIcon,
    XIcon,
    StarIcon,
    MessageCircleIcon,
    UserIcon,
    SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigation from "../components/BottomNavigation";
import SwipeCard from "../components/SwipeCard";
import UserDropdown from "../components/UserDropdown";
// Mock data for profiles
const mockProfiles = [
    {
        id: 1,
        name: "Mai Anh",
        age: 25,
        bio: "Yêu thích du lịch và khám phá những địa điểm mới. Thích uống cà phê buổi tối và trò chuyện.",
        distance: 3,
        matchPercent: 85,
        photos: [
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        ],
        interests: ["CafeTối", "DuLịchBụi", "Âm nhạc", "Phim ảnh"],
    },
    {
        id: 2,
        name: "Hoàng Minh",
        age: 28,
        bio: "Nhiếp ảnh gia, yêu thích âm nhạc và thể thao. Đang tìm kiếm người đồng hành cho những chuyến đi.",
        distance: 5,
        matchPercent: 72,
        photos: [
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        ],
        interests: ["Thể thao", "Chụp ảnh", "DuLịchBụi"],
    },
    {
        id: 3,
        name: "Thu Hà",
        age: 24,
        bio: "Yêu thích nấu ăn và đọc sách. Thích những buổi hẹn hò đơn giản như đi dạo công viên hoặc thưởng thức ẩm thực.",
        distance: 2,
        matchPercent: 91,
        photos: [
            "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        ],
        interests: ["Nấu ăn", "Sách", "Âm nhạc", "CafeTối"],
    },
];
const DiscoveryPage = ({ onMatch }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cardRef = useRef(null);
    const router = useRouter();
    const handleSwipe = (direction) => {
        setSwipeDirection(direction);
        setTimeout(() => {
            if (direction === "right" && Math.random() > 0.5) {
                onMatch(mockProfiles[currentIndex]);
            }
            setCurrentIndex((prevIndex) =>
                Math.min(prevIndex + 1, mockProfiles.length - 1)
            );
            setSwipeDirection(null);
        }, 300);
    };
    const resetSwipe = () => {
        setSwipeDirection(null);
    };
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white p-4 shadow-sm flex justify-between items-center relative">
                <button
                    onClick={() => router.push("/settings")}
                    className="p-2"
                >
                    <SettingsIcon size={24} className="text-gray-500" />
                </button>
                <h1 className="text-xl font-bold text-[#FF5864]">Discover</h1>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2"
                >
                    <UserIcon size={24} className="text-gray-500" />
                </button>
                <UserDropdown
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                />
            </header>
            <main className="flex-1 relative overflow-hidden p-4">
                {currentIndex < mockProfiles.length ? (
                    <div className="h-full flex items-center justify-center">
                        <SwipeCard
                            ref={cardRef}
                            profile={mockProfiles[currentIndex]}
                            direction={swipeDirection}
                            onSwipeComplete={resetSwipe}
                        />
                        {currentIndex + 1 < mockProfiles.length && (
                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center -z-10">
                                <SwipeCard
                                    profile={mockProfiles[currentIndex + 1]}
                                    isBackground={true}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <HeartIcon size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            No more profiles
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Check back later for more people, or adjust your
                            discovery settings.
                        </p>
                        <button
                            onClick={() => setCurrentIndex(0)}
                            className="px-6 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-lg"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </main>
            {currentIndex < mockProfiles.length && (
                <div className="p-4 flex justify-center space-x-6">
                    <button
                        onClick={() => handleSwipe("left")}
                        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200"
                    >
                        <XIcon size={30} className="text-red-500" />
                    </button>
                    <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                        <StarIcon size={24} className="text-blue-500" />
                    </button>
                    <button
                        onClick={() => handleSwipe("right")}
                        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200"
                    >
                        <HeartIcon size={30} className="text-[#FF5864]" />
                    </button>
                </div>
            )}
            <BottomNavigation activeTab="discover" />
        </div>
    );
};
export default DiscoveryPage;

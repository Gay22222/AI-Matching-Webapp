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
import BottomNavigation from "../../components/BottomNavigation";
import SwipeCard from "../../components/SwipeCard";
import UserDropdown from "../../components/UserDropdown";
import { useRecommendations } from "@/hooks/useRecommendations";

const DiscoveryPage = ({ onMatch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cardRef = useRef(null);
  const router = useRouter();
  const { recommendations, isLoading, error } = useRecommendations();

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === "right" && Math.random() > 0.5) {
        onMatch(recommendations[currentIndex]?.recommendedUser);
      }
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + 1, recommendations.length - 1)
      );
      setSwipeDirection(null);
    }, 300);
  };

  const resetSwipe = () => {
    setSwipeDirection(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center relative">
          <button onClick={() => router.push("/settings")} className="p-2">
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
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <HeartIcon size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Đang tải...
            </h2>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center relative">
          <button onClick={() => router.push("/settings")} className="p-2">
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
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <HeartIcon size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Lỗi tải dữ liệu
            </h2>
            <p className="text-gray-600 mb-6">{error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center relative">
        <button onClick={() => router.push("/settings")} className="p-2">
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
        {currentIndex < recommendations.length ? (
          <div className="h-full flex items-center justify-center">
            <SwipeCard
              ref={cardRef}
              profile={{
                id: recommendations[currentIndex]?.recommendedUser?.id,
                name: recommendations[currentIndex]?.recommendedUser?.display_name,
                age: recommendations[currentIndex]?.recommendedUser?.Bio?.age,
                bio: recommendations[currentIndex]?.recommendedUser?.Bio?.about_me,
                distance: 3,
                matchPercent: Math.round(recommendations[currentIndex]?.score * 100),
                photos: recommendations[currentIndex]?.recommendedUser?.Bio?.Photo?.map(
                  photo => photo.url
                ) || [],
                interests: recommendations[currentIndex]?.recommendedUser?.user_favorites?.map(
                  fav => fav.favorite.name
                ) || [], // Lấy interests từ user_favorites
              }}
              direction={swipeDirection}
              onSwipeComplete={resetSwipe}
            />
            {currentIndex + 1 < recommendations.length && (
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center -z-10">
                <SwipeCard
                  profile={{
                    id: recommendations[currentIndex + 1]?.recommendedUser?.id,
                    name: recommendations[currentIndex + 1]?.recommendedUser?.display_name,
                    age: recommendations[currentIndex + 1]?.recommendedUser?.Bio?.age,
                    bio: recommendations[currentIndex + 1]?.recommendedUser?.Bio?.about_me,
                    distance: 3,
                    matchPercent: Math.round(recommendations[currentIndex + 1]?.score * 100),
                    photos: recommendations[currentIndex + 1]?.recommendedUser?.Bio?.Photo?.map(
                      photo => photo.url
                    ) || [],
                    interests: recommendations[currentIndex + 1]?.recommendedUser?.user_favorites?.map(
                      fav => fav.favorite.name
                    ) || [],
                  }}
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
              Không còn hồ sơ nào
            </h2>
            <p className="text-gray-600 mb-6">
              Kiểm tra lại sau để xem thêm người dùng, hoặc điều chỉnh cài đặt khám phá của bạn.
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-6 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-lg"
            >
              Làm mới
            </button>
          </div>
        )}
      </main>
      {currentIndex < recommendations.length && (
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
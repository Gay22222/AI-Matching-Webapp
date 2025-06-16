import React from "react";
import { useRouter } from "next/navigation";

import { FlameIcon, MessageSquareIcon, UserIcon } from "lucide-react";
const BottomNavigation = ({ activeTab }) => {
    const navigate = useRouter();
    return (
        <div className="bg-white border-t border-gray-200 flex justify-around py-3">
            <button
                onClick={() => navigate("/discover")}
                className={`flex flex-col items-center ${
                    activeTab === "discover"
                        ? "text-[#FF5864]"
                        : "text-gray-500"
                }`}
            >
                <FlameIcon size={24} />
                <span className="text-xs mt-1">Discover</span>
            </button>
            <button
                onClick={() => navigate("/chats")}
                className={`flex flex-col items-center ${
                    activeTab === "chats" ? "text-[#FF5864]" : "text-gray-500"
                }`}
            >
                <MessageSquareIcon size={24} />
                <span className="text-xs mt-1">Chats</span>
            </button>
            <button
                onClick={() => navigate("/profile")}
                className={`flex flex-col items-center ${
                    activeTab === "profile" ? "text-[#FF5864]" : "text-gray-500"
                }`}
            >
                <UserIcon size={24} />
                <span className="text-xs mt-1">Profile</span>
            </button>
        </div>
    );
};
export default BottomNavigation;

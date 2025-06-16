import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
    UserIcon,
    SettingsIcon,
    HelpCircleIcon,
    LogOutIcon,
    HeartIcon,
    StarIcon,
} from "lucide-react";

const UserDropdown = ({ isOpen, onClose }) => {
    const navigate = useRouter();
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    const menuItems = [
        {
            icon: <UserIcon size={20} />,
            label: "View Profile",
            onClick: () => navigate("/profile"),
        },
        {
            icon: <HeartIcon size={20} />,
            label: "My Matches",
            onClick: () => navigate("/matches"),
        },
        {
            icon: <StarIcon size={20} />,
            label: "Upgrade to Premium",
            onClick: () => navigate("/premium"),
        },
        {
            icon: <SettingsIcon size={20} />,
            label: "Settings",
            onClick: () => navigate("/settings"),
        },
        {
            icon: <HelpCircleIcon size={20} />,
            label: "Help & Support",
            onClick: () => navigate("/help"),
        },
    ];
    return (
        <div
            ref={dropdownRef}
            className="absolute right-2 top-14 w-64 bg-white rounded-xl shadow-lg overflow-hidden z-50 transform opacity-100 scale-100 transition-all duration-200"
        >
            <div className="p-4 bg-gradient-to-r from-[#FF5864] to-[#FF655B]">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <UserIcon size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">John Doe</h3>
                        <p className="text-white/80 text-sm">
                            View and edit profile
                        </p>
                    </div>
                </div>
            </div>
            <div className="py-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
                <div className="w-full h-px bg-gray-200 my-2"></div>
                <button
                    onClick={() => {
                        // Handle logout
                        navigate("/");
                        onClose();
                    }}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-red-500"
                >
                    <LogOutIcon size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};
export default UserDropdown;

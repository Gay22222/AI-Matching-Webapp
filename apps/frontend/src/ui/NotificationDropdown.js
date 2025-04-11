import React from "react";
import { HeartIcon, MessageCircleIcon, StarIcon } from "lucide-react";
import Link from "next/link";

const notifications = [
    {
        id: "1",
        type: "match",
        user: {
            name: "Linh",
            photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3",
        },
        time: "Vừa xong",
        read: false,
    },
    {
        id: "2",
        type: "like",
        user: {
            name: "Hương",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3",
        },
        time: "5 phút trước",
        read: false,
    },
    {
        id: "3",
        type: "superlike",
        user: {
            name: "Mai",
            photo: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3",
        },
        time: "10 phút trước",
        read: false,
    },
];
const getNotificationContent = (notification) => {
    switch (notification.type) {
        case "match":
            return {
                icon: <HeartIcon className="h-5 w-5 text-[#FF5864]" />,
                text: `Bạn và ${notification.user.name} đã ghép đôi!`,
                link: "/matches",
            };
        case "like":
            return {
                icon: <HeartIcon className="h-5 w-5 text-[#FF5864]" />,
                text: `${notification.user.name} đã thích bạn`,
                link: "/matches",
            };
        case "superlike":
            return {
                icon: <StarIcon className="w-5 h-5 text-blue-500" />,
                text: `${notification.user.name} đã siêu thích bạn!`,
                link: "/matches",
            };
        default:
            return null;
    }
};
const NotificationDropdown = ({ onClose }) => {
    return (
        <div className="absolute right-0 mt-2 overflow-hidden bg-white shadow-lg w-80 rounded-2xl animate-scale-up">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Thông báo</h3>
                    <Link
                        href="/notifications"
                        className="text-sm text-[#FF5864] hover:text-[#FF655B] font-medium"
                    >
                        Xem tất cả
                    </Link>
                </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => {
                    const content = getNotificationContent(notification);
                    return (
                        <Link
                            key={notification.id}
                            href={content.link}
                            onClick={onClose}
                            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors
                       ${!notification.read ? "bg-pink-50/50" : ""}`}
                        >
                            <div className="relative">
                                <img
                                    src={notification.user.photo}
                                    alt={notification.user.name}
                                    className="object-cover w-10 h-10 rounded-full"
                                />
                                <div className="absolute p-1 bg-white rounded-full -bottom-1 -right-1">
                                    {content.icon}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">
                                    {content.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {notification.time}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-[#FF5864] rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
            {notifications.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                    <p>Không có thông báo mới</p>
                </div>
            )}
        </div>
    );
};
export default NotificationDropdown;

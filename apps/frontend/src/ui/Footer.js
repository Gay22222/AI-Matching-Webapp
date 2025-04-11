"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UserIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
const Footer = () => {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;
    const navItems = [
        {
            icon: HomeIcon,
            path: "/",
            label: "Home",
        },
        {
            icon: HeartIcon,
            path: "/matches",
            label: "Matches",
        },
        {
            icon: MessageCircleIcon,
            path: "/chat",
            label: "Messages",
        },
        {
            icon: UserIcon,
            path: "/profile",
            label: "Profile",
        },
    ];
    return (
        <footer className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-200">
            <div className="container mx-auto px-4">
                <nav className="flex justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center py-3 px-4 transition-all duration-300
                          hover:bg-gray-50/50 rounded-lg -mt-px ${
                              active
                                  ? "text-transparent bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text translate-y-[-2px]"
                                  : "text-gray-500"
                          }`}
                            >
                                <Icon
                                    className={`h-6 w-6 transition-transform duration-300 ${
                                        active
                                            ? "stroke-[#FF5864] scale-110"
                                            : "stroke-current hover:scale-105"
                                    }`}
                                />
                                <span
                                    className={`text-xs mt-1 font-medium ${
                                        active ? "opacity-100" : "opacity-80"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </footer>
    );
};
export default Footer;

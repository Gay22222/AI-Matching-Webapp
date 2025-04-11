import React from "react";
import { HeartIcon, MessageCircleIcon, XIcon } from "lucide-react";
import Link from "next/link";

const MatchModal = ({ profile, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative max-w-lg w-full animate-scale-up">
                <div className="relative bg-gradient-to-br from-[#FF5864] to-[#FF655B] rounded-3xl overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-float" />
                        <div
                            className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-float"
                            style={{
                                animationDelay: "-2s",
                            }}
                        />
                    </div>
                    <div className="relative p-8 text-center">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                       transition-colors duration-300"
                        >
                            <XIcon className="h-6 w-6 text-white" />
                        </button>
                        <div className="mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <HeartIcon className="h-24 w-24 text-white animate-bounce" />
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">
                                It's a Match!
                            </h2>
                            <p className="text-white/90 text-lg">
                                Bạn và {profile.name} đã thích nhau
                            </p>
                        </div>
                        <div className="flex justify-center items-center gap-8 mb-10">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-rotate" />
                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3"
                                        alt="Your profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <HeartIcon className="h-10 w-10 text-white animate-pulse" />
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-rotate" />
                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                                    <img
                                        src={profile.photos[0]}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Link
                                href="/chat"
                                className="block w-full bg-white/10 backdrop-blur-md text-white py-4 px-6 rounded-xl font-medium
                         hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <MessageCircleIcon className="h-5 w-5" />
                                    Gửi lời chào
                                </span>
                            </Link>
                            <button
                                onClick={onClose}
                                className="block w-full bg-white text-[#FF5864] py-4 px-6 rounded-xl font-medium
                         hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Tiếp tục tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MatchModal;

import React from "react";
import { HeartIcon, MessageCircleIcon, XIcon } from "lucide-react";
import Link from "next/link";

const MatchModal = ({ me, profile, onClose }) => {
    console.log(me);

    const meAvatar = me.photos.find((photo) => photo?.is_profile_pic);
    const youAvatar = profile.photos.find((photo) => photo?.is_profile_pic);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg animate-scale-up">
                <div className="relative bg-gradient-to-br from-[#FF5864] to-[#FF655B] rounded-3xl overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10" />
                        <div className="absolute w-40 h-40 rounded-full -top-20 -right-20 bg-white/20 blur-3xl animate-float" />
                        <div
                            className="absolute w-40 h-40 rounded-full -bottom-20 -left-20 bg-white/20 blur-3xl animate-float"
                            style={{
                                animationDelay: "-2s",
                            }}
                        />
                    </div>
                    <div className="relative p-8 text-center">
                        <button
                            onClick={onClose}
                            className="absolute p-2 transition-colors duration-300 rounded-full top-4 right-4 bg-white/10 hover:bg-white/20"
                        >
                            <XIcon className="w-6 h-6 text-white" />
                        </button>
                        <div className="mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <HeartIcon className="w-24 h-24 text-white animate-bounce" />
                                    <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
                                </div>
                            </div>
                            <h2 className="mb-2 text-4xl font-bold text-white">
                                It's a Match!
                            </h2>
                            <p className="text-lg text-white/90">
                                Bạn và {profile.name} đã thích nhau
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-8 mb-10">
                            <div className="relative group">
                                <div className="absolute transition duration-1000 rounded-full opacity-75 -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 blur group-hover:opacity-100 group-hover:duration-200 animate-rotate" />
                                <div className="relative overflow-hidden border-4 border-white rounded-full w-28 h-28">
                                    <img
                                        src={
                                            meAvatar?.url?.[0] === "/"
                                                ? `${process.env.NEXT_PUBLIC_API_URL}${meAvatar?.url}`
                                                : "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg"
                                        }
                                        alt="Your profile"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <HeartIcon className="w-10 h-10 text-white animate-pulse" />
                            </div>
                            <div className="relative group">
                                <div className="absolute transition duration-1000 rounded-full opacity-75 -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 blur group-hover:opacity-100 group-hover:duration-200 animate-rotate" />
                                <div className="relative overflow-hidden border-4 border-white rounded-full w-28 h-28">
                                    <img
                                        src={
                                            youAvatar?.url?.[0] === "/"
                                                ? `${process.env.NEXT_PUBLIC_API_URL}${youAvatar?.url}`
                                                : "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg"
                                        }
                                        alt={profile?.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Link
                                href="/matches"
                                className="block w-full px-6 py-4 font-medium text-white transition-all duration-300 transform bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 hover:-translate-y-1"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <MessageCircleIcon className="w-5 h-5" />
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


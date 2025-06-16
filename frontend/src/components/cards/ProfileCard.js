
"use client";

import React, { useState } from "react";
import { HeartIcon, XIcon, StarIcon } from "lucide-react";

const ProfileCard = ({ profile, onHandleMatch, onHandleNext, onSelectProfile }) => {
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isNoped, setIsNoped] = useState(false);
    const [exitDirection, setExitDirection] = useState(null);

    const resetCardState = () => {
        setIsLiked(false);
        setIsNoped(false);
        setExitDirection(null);
    };

    const handleLike = () => {
        setIsLiked(true);
        onHandleMatch(profile.id, resetCardState);
    };

    const handleNope = () => {
        setIsNoped(true);
        setTimeout(() => {
            setIsNoped(false);
            setExitDirection(null);
            onHandleNext();
        }, 500);
    };

    const handleCardClick = (e) => {
        // Ngăn click vào nút Nope/Like kích hoạt detail
        if (e.target.closest("button")) return;
        console.log("Opening profile detail for user:", profile.id);
        onSelectProfile(profile);
    };

    return (
        <div
            className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm 
                        will-change-[transform]
                        transform-gpu duration-500 ease-out
                        hover:shadow-[0_20px_50px_rgba(255,88,100,0.2)]
                        ${!exitDirection ? "hover:translate-y-[8px]" : ""}
                        cursor-pointer`}
            onClick={handleCardClick}
        >
            <div className="relative aspect-[3/4] bg-gray-200 group">
                <div
                    className="absolute inset-0 transition-transform duration-200 ease-out will-change-transform"
                    style={{
                        transform: "translate3d(0,0,0)",
                    }}
                >
                    <img
                        src={profile?.photos?.[currentPhoto]?.url}
                        alt={`${profile.name}'s photo`}
                        className="w-full h-full object-cover"
                        loading="eager"
                        style={{
                            transform: "translate3d(0,0,0)",
                        }}
                    />
                </div>
                <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 px-4 z-20">
                    <div className="glass px-3 py-1.5 rounded-full flex gap-2">
                        {profile?.photos?.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentPhoto(index);
                                }}
                                className={`transform-gpu transition-all duration-200 ease-out
                                    ${index === currentPhoto ? "w-6 h-2 bg-white rounded-full" : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 glass-dark p-6 transform-gpu transition-transform duration-200 ease-out">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                {profile.name}, {profile.age}
                            </h2>
                        </div>
                        <p className="text-sm text-white/90 flex items-center">
                            {profile.distance || "N/A"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {profile.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="glass px-3 py-1 rounded-full text-white text-sm
                                        transform-gpu transition-all duration-200 ease-out
                                        hover:bg-white/30 hover:translate-y-[-2px]
                                        cursor-pointer"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
            <div className="flex justify-center gap-6 p-6">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNope();
                    }}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white
                        will-change-transform
                        shadow-lg hover:shadow-xl transition-all duration-200 ease-out
                        hover:border-red-400 hover:-translate-y-1 group
                        relative before:absolute before:inset-0 before:rounded-full before:border-2
                        before:border-gray-300 before:transition-all before:duration-200
                        hover:before:border-red-400 hover:before:scale-110"
                >
                    <XIcon className="h-8 w-8 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                    }}
                    className="w-14 h-14 flex items-center justify-center rounded-full
                        will-change-transform
                        shadow-lg hover:shadow-xl transition-all duration-200 ease-out
                        hover:-translate-y-1 hover:scale-105 relative overflow-hidden
                        bg-gradient-to-r from-[#FF5864] to-[#FF655B]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF655B] to-[#FF5864] transition-opacity duration-200 opacity-0 hover:opacity-100" />
                    <HeartIcon className="h-8 w-8 text-white relative z-10" />
                </button>
            </div>
            {isLiked && (
                <div className="absolute inset-0 z-50 glass-dark flex items-center justify-center">
                    <HeartIcon className="w-32 h-32 text-[#FF5864] animate-bounce" />
                    <div className="absolute top-8 right-8 glass px-6 py-2 rounded-full">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text text-transparent">
                            Loading...
                        </span>
                    </div>
                </div>
            )}
            {isNoped && (
                <div className="absolute inset-0 z-50 glass-dark flex items-center justify-center">
                    <XIcon className="w-32 h-32 text-red-500 animate-bounce" />
                    <div className="absolute top-8 left-8 glass px-6 py-2 rounded-full">
                        <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                            Loading...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;

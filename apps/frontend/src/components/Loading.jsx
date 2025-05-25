"use client";

import React from "react";

function Loading({ fullScreen = false }) {
    return (
        <div
            className={`flex flex-col items-center justify-center ${
                fullScreen
                    ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm"
                    : "min-h-[200px] w-full"
            }`}
        >
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-[#FF5864] animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-semibold bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text text-transparent animate-pulse">
                Đang tải...
            </p>
        </div>
    );
}

export default Loading;

"use client";

import {
    ArrowLeftIcon,
    MapPinIcon,
    BellIcon,
    ShieldIcon,
    HelpCircleIcon,
    LogOutIcon,
} from "lucide-react";
import { useState } from "react";

function Setting() {
    const [distance, setDistance] = useState(50);
    const [currentAge, setCurrentAge] = useState(30);
    const [rangeWidth, setRangeWidth] = useState(10);
    const [ghostMode, setGhostMode] = useState(false);
    const [showMen, setShowMen] = useState(true);
    const [showWomen, setShowWomen] = useState(true);

    // Calculate the actual age range based on current selection
    const minAge = Math.max(18, currentAge - rangeWidth);
    const maxAge = Math.min(60, currentAge + rangeWidth);

    // Handle changes to the center point
    const handleAgeChange = (e) => {
        setCurrentAge(parseInt(e.target.value));
    };

    // Handle changes to the range width
    const handleWidthChange = (e) => {
        setRangeWidth(parseInt(e.target.value));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white p-4 shadow-sm flex items-center">
                <button onClick={() => navigate(-1)} className="mr-3">
                    <ArrowLeftIcon size={24} className="text-gray-500" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            </header>
            <main className="flex-1 p-4">
                <div className="space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Discovery Settings
                        </h2>
                        <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-gray-700">
                                        Distance
                                    </label>
                                    <span className="text-[#FF5864] font-medium">
                                        {distance} km
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={distance}
                                    onChange={(e) =>
                                        setDistance(parseInt(e.target.value))
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF5864]"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1 km</span>
                                    <span>100 km</span>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-between mb-2">
                                    <label className="text-gray-700">
                                        Age Range
                                    </label>
                                    <span className="text-pink-500 font-medium">
                                        {minAge} - {maxAge}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Center Age: {currentAge}
                                    </label>
                                    <input
                                        type="range"
                                        min="18"
                                        max="60"
                                        value={currentAge}
                                        onChange={handleAgeChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>18</span>
                                        <span>60+</span>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Range Width: ±{rangeWidth} years
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="21"
                                        value={rangeWidth}
                                        onChange={handleWidthChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Exact</span>
                                        <span>Wide</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-700 mb-2 block">
                                    Show Me
                                </label>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowMen(!showMen)}
                                        className={`flex-1 py-2 rounded-lg border ${
                                            showMen
                                                ? "bg-[#FF5864] text-white border-[#FF5864]"
                                                : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                    >
                                        Men
                                    </button>
                                    <button
                                        onClick={() => setShowWomen(!showWomen)}
                                        className={`flex-1 py-2 rounded-lg border ${
                                            showWomen
                                                ? "bg-[#FF5864] text-white border-[#FF5864]"
                                                : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                    >
                                        Women
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-800">
                                        Ghost Mode
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Only show your profile to people you
                                        like
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={ghostMode}
                                        onChange={() =>
                                            setGhostMode(!ghostMode)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5864]"></div>
                                </label>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                                <BellIcon
                                    size={20}
                                    className="text-gray-600 mr-3"
                                />
                                <span>Notifications</span>
                            </div>
                            <span className="text-gray-400">›</span>
                        </button>
                        <div className="w-full h-px bg-gray-200"></div>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                                <ShieldIcon
                                    size={20}
                                    className="text-gray-600 mr-3"
                                />
                                <span>Privacy & Security</span>
                            </div>
                            <span className="text-gray-400">›</span>
                        </button>
                        <div className="w-full h-px bg-gray-200"></div>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                                <HelpCircleIcon
                                    size={20}
                                    className="text-gray-600 mr-3"
                                />
                                <span>Help & Support</span>
                            </div>
                            <span className="text-gray-400">›</span>
                        </button>
                    </section>
                    <button className="w-full p-4 bg-white rounded-lg shadow-sm text-red-500 flex items-center justify-center">
                        <LogOutIcon size={20} className="mr-2" />
                        <span>Log Out</span>
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Setting;

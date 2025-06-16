import React, {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    HeartIcon,
    XIcon,
    MapPinIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
const SwipeCard = forwardRef(
    ({ profile, direction, onSwipeComplete, isBackground = false }, ref) => {
        const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
        const [showDetails, setShowDetails] = useState(false);
        useEffect(() => {
            if (direction && !isBackground) {
                const timer = setTimeout(() => {
                    if (onSwipeComplete) onSwipeComplete();
                }, 300);
                return () => clearTimeout(timer);
            }
        }, [direction, onSwipeComplete, isBackground]);
        const nextPhoto = (e) => {
            e.stopPropagation();
            if (currentPhotoIndex < profile.photos.length - 1) {
                setCurrentPhotoIndex(currentPhotoIndex + 1);
            }
        };
        const prevPhoto = (e) => {
            e.stopPropagation();
            if (currentPhotoIndex > 0) {
                setCurrentPhotoIndex(currentPhotoIndex - 1);
            }
        };
        const toggleDetails = () => {
            if (!isBackground) {
                setShowDetails(!showDetails);
            }
        };
        const getSwipeClass = () => {
            if (!direction) return "";
            return direction === "right"
                ? "translate-x-[120%] rotate-12 transition-transform duration-300"
                : "translate-x-[-120%] -rotate-12 transition-transform duration-300";
        };
        return (
            <div
                className={`w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden shadow-xl relative 
          ${isBackground ? "scale-[0.95] opacity-70" : getSwipeClass()}`}
                onClick={toggleDetails}
            >
                {/* Photo */}
                <div className="w-full h-full relative">
                    <img
                        src={profile.photos[currentPhotoIndex]}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                    />
                    {/* Photo navigation */}
                    {!isBackground && profile.photos.length > 1 && (
                        <>
                            <div
                                className="absolute top-0 left-0 w-1/3 h-full flex items-center"
                                onClick={prevPhoto}
                            >
                                {currentPhotoIndex > 0 && (
                                    <ChevronLeftIcon
                                        size={40}
                                        className="text-white drop-shadow-lg ml-2"
                                    />
                                )}
                            </div>
                            <div
                                className="absolute top-0 right-0 w-1/3 h-full flex items-center justify-end"
                                onClick={nextPhoto}
                            >
                                {currentPhotoIndex <
                                    profile.photos.length - 1 && (
                                    <ChevronRightIcon
                                        size={40}
                                        className="text-white drop-shadow-lg mr-2"
                                    />
                                )}
                            </div>
                        </>
                    )}
                    {/* Photo indicators */}
                    {!isBackground && profile.photos.length > 1 && (
                        <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1">
                            {profile.photos.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 rounded-full ${
                                        index === currentPhotoIndex
                                            ? "w-6 bg-white"
                                            : "w-2 bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                    {/* Swipe indicators */}
                    {direction === "right" && !isBackground && (
                        <div className="absolute top-10 left-5 transform -rotate-12">
                            <div className="border-4 border-green-500 rounded-lg px-2 py-1">
                                <HeartIcon
                                    size={40}
                                    className="text-green-500"
                                />
                            </div>
                        </div>
                    )}
                    {direction === "left" && !isBackground && (
                        <div className="absolute top-10 right-5 transform rotate-12">
                            <div className="border-4 border-red-500 rounded-lg px-2 py-1">
                                <XIcon size={40} className="text-red-500" />
                            </div>
                        </div>
                    )}
                    {/* Match percentage */}
                    {!isBackground && (
                        <div className="absolute top-4 right-4 bg-[#FF5864] text-white px-2 py-1 rounded-full text-sm font-bold">
                            {profile.matchPercent}% Match
                        </div>
                    )}
                    {/* Basic info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                        <h2 className="text-2xl font-bold">
                            {profile.name}, {profile.age}
                        </h2>
                        <div className="flex items-center mt-1">
                            <MapPinIcon size={16} className="mr-1" />
                            <span className="text-sm">
                                {profile.distance} km away
                            </span>
                        </div>
                    </div>
                </div>
                {/* Details panel (slides up when card is tapped) */}
                {!isBackground && (
                    <div
                        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 transform transition-transform duration-300 
              ${showDetails ? "translate-y-0" : "translate-y-full"}`}
                        style={{
                            height: "70%",
                        }}
                    >
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {profile.name}, {profile.age}
                        </h2>
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPinIcon size={16} className="mr-1" />
                            <span className="text-sm">
                                {profile.distance} km away
                            </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                            About
                        </h3>
                        <p className="text-gray-600 mb-4">{profile.bio}</p>
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest) => (
                                <div
                                    key={interest}
                                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                >
                                    #{interest}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);
export default SwipeCard;

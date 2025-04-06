"use client";

import React, { useState } from "react";
import { PlusIcon, XIcon, CameraIcon, CheckIcon } from "lucide-react";
const ProfileCreationPage = () => {
    const [photos, setPhotos] = useState([null, null, null]);
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const popularInterests = [
        "CafeTối",
        "DuLịchBụi",
        "Âm nhạc",
        "Phim ảnh",
        "Thể thao",
        "Nấu ăn",
        "Sách",
        "Yoga",
        "Chụp ảnh",
        "Công nghệ",
        "Thời trang",
        "Nghệ thuật",
        "Thú cưng",
        "Thiên nhiên",
        "Lập trình",
    ];
    const handleAddInterest = (interest) => {
        if (!interests.includes(interest) && interests.length < 10) {
            setInterests([...interests, interest]);
        }
    };
    const handleRemoveInterest = (interest) => {
        setInterests(interests.filter((i) => i !== interest));
    };
    const handlePhotoUpload = (index) => {
        // In a real app, this would open a file picker
        // For demo purposes, we'll just add a placeholder
        const newPhotos = [...photos];
        newPhotos[index] = `https://i.pravatar.cc/300?img=${index + 10}`;
        setPhotos(newPhotos);
    };
    const handleRemovePhoto = (index) => {
        const newPhotos = [...photos];
        newPhotos[index] = null;
        setPhotos(newPhotos);
    };
    const handleSubmit = () => {
        // In a real app, this would save the profile
        navigate("/discover");
    };
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="bg-gradient-to-r from-[#FF5864] to-[#FF655B] p-4 text-white">
                <h1 className="text-xl font-bold">Create Your Profile</h1>
                <div className="flex mt-4">
                    <div
                        className={`flex-1 h-1 rounded-l-full ${
                            currentStep >= 1 ? "bg-white" : "bg-white/30"
                        }`}
                    ></div>
                    <div
                        className={`flex-1 h-1 ${
                            currentStep >= 2 ? "bg-white" : "bg-white/30"
                        }`}
                    ></div>
                    <div
                        className={`flex-1 h-1 rounded-r-full ${
                            currentStep >= 3 ? "bg-white" : "bg-white/30"
                        }`}
                    ></div>
                </div>
            </div>
            <div className="flex-1 p-4">
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Add your best photos
                        </h2>
                        <p className="text-gray-600">
                            Your photos are the first thing people see. Add up
                            to 6 photos to show your best self.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="aspect-[3/4] bg-gray-100 rounded-lg relative overflow-hidden max-h-[500px] w-full"
                                >
                                    {photo ? (
                                        <>
                                            <img
                                                src={photo}
                                                alt={`Profile ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleRemovePhoto(index)
                                                }
                                                className="absolute top-1 right-1 bg-white rounded-full p-1"
                                            >
                                                <XIcon
                                                    size={16}
                                                    className="text-gray-700"
                                                />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handlePhotoUpload(index)
                                            }
                                            className="w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <CameraIcon
                                                size={32}
                                                className="text-gray-400"
                                            />
                                            <span className="text-xs text-gray-500 mt-1">
                                                Add photo
                                            </span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Tell us about yourself
                        </h2>
                        <p className="text-gray-600">
                            Write a short bio to let others know what makes you
                            unique.
                        </p>
                        <div>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="I love hiking, watching movies, and trying new restaurants..."
                                className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                maxLength={500}
                            ></textarea>
                            <p className="text-right text-sm text-gray-500 mt-1">
                                {bio.length}/500
                            </p>
                        </div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            What are your interests?
                        </h2>
                        <p className="text-gray-600">
                            Select interests to help us find better matches for
                            you.
                        </p>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest) => (
                                    <div
                                        key={interest}
                                        className="bg-[#FF5864] text-white px-3 py-1 rounded-full flex items-center gap-1"
                                    >
                                        <span>#{interest}</span>
                                        <button
                                            onClick={() =>
                                                handleRemoveInterest(interest)
                                            }
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {popularInterests
                                    .filter((i) => !interests.includes(i))
                                    .map((interest) => (
                                        <button
                                            key={interest}
                                            onClick={() =>
                                                handleAddInterest(interest)
                                            }
                                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200"
                                        >
                                            #{interest}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between">
                    <button
                        onClick={() =>
                            setCurrentStep(Math.max(1, currentStep - 1))
                        }
                        className={`px-6 py-2 rounded-lg ${
                            currentStep === 1 ? "invisible" : "visible"
                        }`}
                    >
                        Back
                    </button>
                    {currentStep < 3 ? (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="px-6 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-lg"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-lg flex items-center gap-2"
                        >
                            <span>Finish</span>
                            <CheckIcon size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ProfileCreationPage;

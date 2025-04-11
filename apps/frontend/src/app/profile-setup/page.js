"use client";
import React, { useState, Component } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, FlameIcon } from "lucide-react";
import Steps from "./components/Steps";
import BasicInfo from "./components/BasicInfo";
import PhotoUpload from "./components/PhotoUpload";
import BioInterests from "./components/BioInterests";
import Location from "./components/Location";
import Preferences from "./components/Preferences";

const ProfileSetup = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        birthday: "",
        gender: "",
        ageRange: 25,
        photos: [],
        bio: "",
        interests: [],
        location: "",
        searchRadius: 10,
        preferences: [],
    });
    const steps = [
        {
            title: "Thông tin cơ bản",
            component: BasicInfo,
        },
        {
            title: "Ảnh của bạn",
            component: PhotoUpload,
        },
        {
            title: "Sở thích & Tiêu chí",
            component: Preferences,
        },
        {
            title: "Giới thiệu bản thân",
            component: BioInterests,
        },
        {
            title: "Vị trí",
            component: Location,
        },
    ];
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleComplete = () => {
        console.log("Profile setup complete:", formData);
        // Navigate to main app
    };
    const CurrentStepComponent = steps[currentStep].component;
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-50">
            {/* Header */}
            <header className="sticky top-0 z-10 shadow-sm bg-white/80 backdrop-blur-md">
                <div className="container flex items-center justify-between px-4 py-3 mx-auto">
                    <div className="flex items-center">
                        {currentStep > 0 ? (
                            <button
                                onClick={handlePrevious}
                                className="p-2 transition-colors rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                            </button>
                        ) : (
                            <Link href="/" className="flex items-center gap-2">
                                <FlameIcon className="h-6 w-6 text-[#FF5864]" />
                                <span className="font-bold text-transparent bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text">
                                    DateViet
                                </span>
                            </Link>
                        )}
                    </div>
                    <Steps
                        currentStep={currentStep}
                        totalSteps={steps.length}
                    />
                    <div className="w-10" /> {/* Spacer for alignment */}
                </div>
            </header>
            {/* Main Content */}
            <main className="container flex-grow px-4 py-8 mx-auto">
                <div className="max-w-2xl mx-auto">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900">
                        {steps[currentStep].title}
                    </h1>
                    <div className="p-6 bg-white shadow-lg rounded-2xl">
                        <CurrentStepComponent
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            </main>
            {/* Footer */}
            <footer className="sticky bottom-0 border-t border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="container px-4 py-4 mx-auto">
                    <div className="max-w-2xl mx-auto">
                        {currentStep === steps.length - 1 ? (
                            <button
                                onClick={handleComplete}
                                className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-4 px-6 rounded-xl font-medium
                         hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Hoàn tất
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-4 px-6 rounded-xl font-medium
                         hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                         flex items-center justify-center gap-2"
                            >
                                Tiếp theo
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default ProfileSetup;

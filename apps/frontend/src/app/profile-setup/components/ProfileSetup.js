"use client";
import React, { useState, Component } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, FlameIcon } from "lucide-react";
import Steps from "./Steps";
import BasicInfo from "./BasicInfo";
import PhotoUpload from "./PhotoUpload";
import BioInterests from "./BioInterests";
import Location from "./Location";
import Preferences from "./Preferences";
import { useMetadata } from "@/hooks/useMetadata";
const ProfileSetup = () => {
    const metadata = useMetadata();

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
    console.log(formData);

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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-rose-50">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        {currentStep > 0 ? (
                            <button
                                onClick={handlePrevious}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
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
                    <div className="w-10" />
                </div>
            </header>
            <main className="flex-grow container mx-auto max-w-[700px] px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        {steps[currentStep].title}
                    </h1>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <CurrentStepComponent
                            metadata={metadata?.metadata}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            </main>
            <footer className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-200">
                <div className="container mx-auto px-4 py-4">
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
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default ProfileSetup;

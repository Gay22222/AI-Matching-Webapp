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
import { useRouter } from "next/navigation";

import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
setupAxios(axios);
import { getData } from "@/utils/LocalStorage";
const ProfileSetup = () => {
    const router = useRouter();

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
    const handleComplete = async () => {
        function transformUserData(input) {
            const genderMap = { Nam: "male", Nữ: "female", Khác: "other" };

            return {
                user: {
                    id: 1, // hoặc null nếu là user mới
                    displayName: input.name,
                    email: "john@example.com", // nên lấy từ input nếu có
                    gender: genderMap[input.gender] || "other",
                    preferredGender: "female", // hardcoded or from another field
                    name: input.name,
                    age: parseInt(input.ageRange),
                    aboutMe: input.bio,
                    height: "170", // hardcoded or dynamic
                    location: input.location,
                    languageId: 1, // mặc định nếu chưa có
                    religionId: input.preferences["Tôn giáo"] || 2,
                    careerId: 1,
                    educationId: input.preferences["Giáo dục"],
                    zodiacId: input.preferences["Cung hoàng đạo"],
                    characterId: input.preferences["Kiểu tính cách"],
                    communicateStyleId: 1,
                    loveLanguageId: 1,
                    futureFamilyId: input.preferences["Gia đình tương lai"],
                    drink: input.preferences["Về việc uống bia rượu"] === 2,
                    smoke:
                        input.preferences["Bạn có hay hút thuốc không?"] === 2,
                    train: input.preferences["Tập luyện"] === 2,
                    petId: input.preferences["Thú cưng"],
                    dietId: input.preferences["Chế độ ăn uống"],
                    sleepId: input.preferences["Thói quen ngủ"],
                    snuId: input.preferences["Truyền thông xã hội"],
                    photos: input.photos || [],
                    favorites: input.interests || [],
                    maxRadius: input.searchRadius,
                },
            };
        }
        const result = transformUserData(formData);
        console.log(result);
        const token = getData("token");
        const res = await axios.put("http://localhost:3001/api/update-profile", result, {
            withCredentials: true,
        });
        const me = await axios.get("http://localhost:3001/api/me", {
            withCredentials: true,
        });
        setProfileSetupData(me.data.userWithoutPassword);
        router.push("/");
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

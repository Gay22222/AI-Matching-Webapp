"use client";
import React, { useState, Component, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";

import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
setupAxios(axios);
const genderMap = { Nam: "male", Nữ: "female", Khác: "other" };

const ProfileSetup = () => {
    const router = useRouter();
    const { auth, currentUser } = useAuth();
    const metadata = useMetadata();
    const formDataMap = {
        zodiacId: "Cung hoàng đạo",
        educationId: "Giáo dục",
        futureFamilyId: "Gia đình tương lai",
        characterId: "Kiểu tính cách",
        drink: "Về việc uống bia rượu",
        smoke: "Bạn có hay hút thuốc không?",
        train: "Tập luyện",
        dietId: "Chế độ ăn uống",
        snuId: "Truyền thông xã hội",
        sleepId: "Thói quen ngủ",
        petId: "Thú cưng",
    };
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: currentUser?.displayName || "",
        birthday: "",
        gender: currentUser?.gender
            ? Object.keys(genderMap).find(
                  (key) => genderMap[key] === currentUser.gender
              )
            : "Nam",
        ageRange: currentUser?.age,
        photos: [],
        photoFiles: [],
        bio: "",
        interests: [],
        location: "",
        searchRadius: 10,
        preferences: Object.entries(formDataMap).reduce((acc, [key, value]) => {
            if (currentUser && currentUser[key] !== undefined) {
                if (key === "drink" || key === "smoke" || key === "train") {
                    acc[value] = currentUser[key] === false ? 2 : 1;
                } else {
                    acc[value] = currentUser[key];
                }
            }
            return acc;
        }, {}),
    });

    useEffect(() => {
        if (currentUser) {
            let formattedBirthday = "";
            if (currentUser.birthday) {
                try {
                    const date = new Date(currentUser.birthday);
                    if (!isNaN(date.getTime())) {
                        formattedBirthday = date.toISOString().split("T")[0];
                    }
                } catch (error) {
                    console.error("Error formatting birthday:", error);
                }
            }
            setFormData((prev) => ({
                ...prev,
                name: currentUser.displayName,
                birthday: formattedBirthday,
                gender: currentUser.gender
                    ? Object.keys(genderMap).find(
                          (key) => genderMap[key] === currentUser.gender
                      )
                    : "Nam",
                ageRange: currentUser.age,
                photoFiles:
                    currentUser?.photos?.map((photo) => photo?.url) || [],
                bio: currentUser.aboutMe || "",
                interests: currentUser.favorites,
                location: currentUser.location,
                searchRadius: currentUser.searchRadius,
                preferences: Object.entries(formDataMap).reduce(
                    (acc, [key, value]) => {
                        if (currentUser && currentUser[key] !== undefined) {
                            if (
                                key === "drink" ||
                                key === "smoke" ||
                                key === "train"
                            ) {
                                acc[value] = currentUser[key] === false ? 2 : 1;
                            } else {
                                acc[value] = currentUser[key];
                            }
                        }
                        return acc;
                    },
                    {}
                ),
            }));
        }
    }, [currentUser]);

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
            let birthdayDate = null;
            if (input.birthday) {
                try {
                    birthdayDate = new Date(input.birthday);
                    if (isNaN(birthdayDate.getTime())) {
                        console.error("Invalid date format for birthday");
                        birthdayDate = null;
                    }
                } catch (error) {
                    console.error("Error parsing birthday date:", error);
                }
            }
            return {
                user: {
                    id: currentUser?.id,
                    displayName: input.name,
                    email: currentUser?.email,
                    gender: genderMap[input.gender] || "other",
                    preferredGender: genderMap[input.gender] || "other",
                    name: input.name,
                    age: parseInt(input.ageRange),
                    aboutMe: input.bio,
                    // height: "170",
                    location: input.location,
                    birthday: birthdayDate ? birthdayDate.toISOString() : null,
                    languageId: 1,
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
                    favorites: input.interests || [],
                    maxRadius: input.searchRadius,
                },
            };
        }
        const result = transformUserData(formData);

        const photos = formData?.photoFiles || [];
        console.log(photos);

        if (photos.length > 0) {
            const formData = new FormData();
            formData.append("bioId", currentUser?.bioId);

            const existingPhotoUrls = [];
            const newPhotos = [];

            // Phân loại ảnh
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                if (typeof photo === "string") {
                    existingPhotoUrls.push(photo);
                } else if (photo instanceof File) {
                    newPhotos.push(photo);
                    formData.append("images", photo);
                }
            }

            if (newPhotos.length > 0) {
                try {
                    const postPhotos = await axios.post(
                        "http://localhost:3001/api/upload/multiple",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${auth?.access_token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    console.log("Upload response:", postPhotos.data);
                } catch (error) {
                    console.error(
                        "Upload error:",
                        error.response?.data || error.message
                    );
                    return;
                }
            } else if (existingPhotoUrls.length > 0) {
                result.user.photos = existingPhotoUrls;
            }
        }

        const res = await axios.put(
            "http://localhost:3001/api/update-profile",
            result,
            {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            }
        );
        if (res?.data?.statusCode === 200) router.push("/");
    };
    const CurrentStepComponent = steps[currentStep].component;
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-50">
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
                    <div className="w-10" />
                </div>
            </header>
            <main className="flex-grow container mx-auto max-w-[700px] px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900">
                        {steps[currentStep].title}
                    </h1>
                    <div className="p-6 bg-white shadow-lg rounded-2xl">
                        <CurrentStepComponent
                            metadata={metadata?.metadata}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            </main>
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

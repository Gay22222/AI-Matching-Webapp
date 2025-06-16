"use client";

import React, { useState, useEffect } from "react";
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
        ageRange: currentUser?.age || 18,
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
            console.log("Current user:", JSON.stringify(currentUser, null, 2));
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
            const photoUrls = Array.isArray(currentUser?.photos)
                ? currentUser.photos.map((photo) => photo?.url || "").filter(Boolean)
                : [];
            const newFormData = {
                name: currentUser.displayName || "",
                birthday: formattedBirthday,
                gender: currentUser.gender
                    ? Object.keys(genderMap).find(
                          (key) => genderMap[key] === currentUser.gender
                      )
                    : "Nam",
                ageRange: currentUser.age || 18,
                photoFiles: photoUrls,
                photos: photoUrls,
                bio: currentUser.aboutMe || "",
                interests: Array.isArray(currentUser.favorites) ? currentUser.favorites : [],
                location: currentUser.location || "",
                searchRadius: currentUser.searchRadius || 10,
                preferences: Object.entries(formDataMap).reduce(
                    (acc, [key, value]) => {
                        if (currentUser && currentUser[key] !== undefined) {
                            if (key === "drink" || key === "smoke" || key === "train") {
                                acc[value] = currentUser[key] === false ? 2 : 1;
                            } else {
                                acc[value] = currentUser[key];
                            }
                        }
                        return acc;
                    },
                    {}
                ),
            };
            console.log("Updated formData:", JSON.stringify(newFormData, null, 2));
            setFormData(newFormData);
        }
    }, [currentUser]);

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
                        console.error("Invalid date format for birthday:", input.birthday);
                        birthdayDate = null;
                    }
                } catch (error) {
                    console.error("Error parsing birthday date:", error);
                }
            }
            const result = {
                user: {
                    id: currentUser?.id,
                    displayName: input.name || "",
                    gender: genderMap[input.gender] || "other",
                    preferredGender: genderMap[input.gender] || "other",
                    name: input.name || "",
                    age: parseInt(input.ageRange) || 18,
                    aboutMe: input.bio || "",
                    location: input.location || "",
                    birthday: birthdayDate ? birthdayDate.toISOString() : null,
                    languageId: parseInt(input.preferences["Ngôn ngữ"]) || 1,
                    religionId: parseInt(input.preferences["Tôn giáo"]) || 2,
                    careerId: parseInt(input.preferences["Nghề nghiệp"]) || 1,
                    educationId: parseInt(input.preferences["Giáo dục"]) || 1,
                    zodiacId: parseInt(input.preferences["Cung hoàng đạo"]) || 1,
                    characterId: parseInt(input.preferences["Kiểu tính cách"]) || 1,
                    communicateStyleId: parseInt(input.preferences["Phong cách giao tiếp"]) || 1,
                    loveLanguageId: parseInt(input.preferences["Ngôn ngữ tình yêu"]) || 1,
                    futureFamilyId: parseInt(input.preferences["Gia đình tương lai"]) || 1,
                    drink: input.preferences["Về việc uống bia rượu"] === 2,
                    smoke: input.preferences["Bạn có hay hút thuốc không?"] === 2,
                    train: input.preferences["Tập luyện"] === 2,
                    petId: parseInt(input.preferences["Thú cưng"]) || 1,
                    dietId: parseInt(input.preferences["Chế độ ăn uống"]) || 1,
                    sleepId: parseInt(input.preferences["Thói quen ngủ"]) || 1,
                    snuId: parseInt(input.preferences["Truyền thông xã hội"]) || 1,
                    favorites: Array.isArray(input.interests) ? input.interests : [],
                    maxRadius: input.searchRadius || 10,
                    photos: [] // Sẽ được gán sau
                },
            };
            console.log("Transformed user data:", JSON.stringify(result, null, 2));
            return result;
        }

        async function retryRequest(fn, retries = 2, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (i === retries - 1) throw error;
                    console.log(`Retrying request (${i + 1}/${retries})...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        try {
            if (!currentUser?.id) {
                throw new Error("User ID is missing");
            }
            if (!currentUser?.bioId) {
                throw new Error("Bio ID is missing");
            }
            if (!auth?.access_token) {
                throw new Error("Access token is missing");
            }

            const result = transformUserData(formData);
            const photos = Array.isArray(formData?.photoFiles) ? formData.photoFiles : [];
            console.log("Photos to process:", photos);

            if (photos.length > 0) {
                const formDataUpload = new FormData();
                formDataUpload.append("bioId", currentUser.bioId);

                // Lấy danh sách ảnh hiện có từ currentUser.photos
                const existingPhotos = Array.isArray(currentUser?.photos)
                    ? currentUser.photos.map((photo) => ({
                          id: photo.id,
                          url: photo.url,
                          is_profile_pic: photo.is_profile_pic,
                      }))
                    : [];
                const newPhotos = [];

                for (let i = 0; i < photos.length; i++) {
                    const photo = photos[i];
                    if (typeof photo === "string") {
                        // Tìm photo tương ứng trong existingPhotos
                        const existingPhoto = existingPhotos.find(p => p.url === photo);
                        if (existingPhoto) {
                            existingPhotos.push(existingPhoto);
                        } else {
                            existingPhotos.push({ url: photo, is_profile_pic: i === 0 });
                        }
                    } else if (photo instanceof File) {
                        newPhotos.push(photo);
                        formDataUpload.append("images", photo);
                    }
                }

                console.log("Existing photos:", existingPhotos);
                console.log("New photos to upload:", newPhotos.length);

                if (newPhotos.length > 0) {
                    console.log("Uploading photos...");
                    try {
                        const postPhotos = await retryRequest(() =>
                            axios.post(
                                "http://localhost:3001/api/upload/multiple",
                                formDataUpload,
                                {
                                    headers: {
                                        Authorization: `Bearer ${auth.access_token}`,
                                        "Content-Type": "multipart/form-data",
                                    },
                                }
                            )
                        );
                        console.log("Upload response:", JSON.stringify(postPhotos.data, null, 2));
                        result.user.photos = [
                            ...postPhotos.data.photos.map((photo) => ({
                                id: photo.id,
                                url: photo.url,
                                is_profile_pic: photo.is_profile_pic || false,
                            })),
                            ...existingPhotos.filter(p => !newPhotos.some(np => np.url === p.url)),
                        ];
                    } catch (uploadError) {
                        console.error("Photo upload error:", {
                            message: uploadError.message,
                            response: uploadError.response?.data,
                            status: uploadError.response?.status,
                        });
                        alert(`Lỗi khi upload ảnh: ${uploadError.response?.data?.message || uploadError.message}`);
                        throw uploadError;
                    }
                } else {
                    result.user.photos = existingPhotos;
                }
            }

            console.log("Profile update request:", JSON.stringify(result, null, 2));
            try {
                const res = await retryRequest(() =>
                    axios.put(
                        "http://localhost:3001/api/user/update-profile",
                        result,
                        {
                            headers: {
                                Authorization: `Bearer ${auth.access_token}`,
                            },
                        }
                    )
                );
                console.log("Profile update response:", JSON.stringify(res.data, null, 2));

                if (res?.data?.statusCode === 200) {
                    router.push("/");
                } else {
                    console.error("Unexpected response:", res.data);
                    alert("Cập nhật hồ sơ thất bại: Phản hồi không mong muốn từ server");
                    throw new Error("Unexpected response from server");
                }
            } catch (updateError) {
                console.error("Profile update error:", {
                    message: updateError.message,
                    response: updateError.response?.data,
                    status: updateError.response?.status,
                });
                alert(`Lỗi khi cập nhật hồ sơ: ${updateError.response?.data?.message || updateError.message}`);
                throw updateError;
            }
        } catch (error) {
            console.error("Error in handleComplete:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack,
            });
            alert(`Lỗi hệ thống: ${error.response?.data?.message || error.message}`);
            throw error;
        }
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
                    <Steps currentStep={currentStep} totalSteps={steps.length} />
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
                                className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Hoàn tất
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
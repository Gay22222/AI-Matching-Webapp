"use client";
import React, { useEffect, useState } from "react";
import { CameraIcon, EditIcon, Loader2Icon, XIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMetadata } from "@/hooks/useMetadata";

const Profile = () => {
    const { auth, currentUser } = useAuth();
    const { metadata } = useMetadata();
    console.log(currentUser);

    const [showBioModal, setShowBioModal] = useState(false);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
    const [profile, setProfile] = useState({
        name: currentUser?.displayName,
        age: currentUser?.age,
        location: currentUser?.location,
        bio: currentUser?.aboutMe,
        interests:
            currentUser?.favorites?.map(
                (favorite) =>
                    metadata?.favorites.find((f) => f.id === favorite)?.value
            ) || [],
        photos: [],
        profilePhoto: "",
    });

    console.log(profile);

    useEffect(() => {
        if (currentUser) {
            setProfile((prev) => ({
                ...prev,
                name: currentUser?.displayName,
                age: currentUser?.age,
                location: currentUser?.location,
                bio: currentUser?.aboutMe,
                interests:
                    currentUser?.favorites?.map(
                        (favorite) =>
                            metadata?.favorites.find((f) => f.id === favorite)
                                ?.value
                    ) || [],
                photos: currentUser?.photos || [],
                profilePhoto:
                    currentUser?.profilePhoto ||
                    "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg",
            }));
        }
    }, [currentUser]);

    return (
        <div className="w-full max-w-md py-4 mx-auto">
            <div className="overflow-hidden bg-white rounded-lg shadow-sm max-h-[76vh] overflow-y-auto">
                {/* Profile header */}
                <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-[#FF5864] to-[#FF655B]"></div>
                    <div className="absolute transform -translate-x-1/2 left-1/2 -bottom-16">
                        <div className="relative group">
                            <img
                                src={profile?.profilePhoto || ""}
                                alt="Profile"
                                className="object-cover w-32 h-32 transition-transform duration-300 border-4 border-white rounded-full group-hover:scale-105"
                            />
                            <button
                                onClick={() => setShowProfilePhotoModal(true)}
                                className="absolute bottom-0 right-0 bg-[#FF5864] p-2 rounded-full text-white
                         shadow-lg transition-transform duration-300 hover:scale-110"
                            >
                                <CameraIcon className="w-4 h-4" />
                            </button>
                            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 rounded-full opacity-0 bg-black/50 group-hover:opacity-100">
                                <span className="text-sm font-medium text-white">
                                    Thay đổi ảnh
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile info */}
                <div className="px-4 pt-20 pb-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {profile.name}, {profile.age}
                        </h1>
                        <p className="text-gray-600">{profile.location}</p>
                    </div>
                    {/* Bio */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Giới thiệu
                            </h2>
                            <button
                                onClick={() => setShowBioModal(true)}
                                className="text-[#FF5864] hover:scale-110 transition-transform duration-300"
                            >
                                <EditIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-gray-600">{profile.bio}</p>
                    </div>
                    {/* Tags */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Sở thích
                            </h2>
                            <button
                                onClick={() => setShowInterestsModal(true)}
                                className="text-[#FF5864] hover:scale-110 transition-transform duration-300"
                            >
                                <EditIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 text-sm text-gray-700 transition-colors duration-300 bg-gray-100 rounded-full hover:bg-gray-200"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Photos */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Ảnh ({profile.photos.length}/6)
                            </h2>
                            <button
                                onClick={() => setShowPhotoModal(true)}
                                className="text-[#FF5864] hover:scale-110 transition-transform duration-300"
                            >
                                <EditIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {profile.photos
                                .filter((photo) => photo?.url)
                                .map((photo, index) => (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden bg-gray-200 rounded-lg aspect-square group"
                                    >
                                        <img
                                            src={`http://localhost:3001${photo?.url}`}
                                            alt={`Photo ${index + 1}`}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                            {[
                                ...Array(
                                    6 -
                                        profile.photos.filter(
                                            (photo) => photo?.url
                                        ).length
                                ),
                            ].map((_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="flex items-center justify-center transition-colors duration-300 bg-gray-100 rounded-lg cursor-pointer aspect-square hover:bg-gray-200"
                                    onClick={() => setShowPhotoModal(true)}
                                >
                                    <CameraIcon className="w-6 h-6 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showBioModal && (
                <EditBioModal
                    bio={profile.bio}
                    onSave={(newBio) => {
                        setProfile((prev) => ({
                            ...prev,
                            bio: newBio,
                        }));
                        setShowBioModal(false);
                    }}
                    onClose={() => setShowBioModal(false)}
                />
            )}
            {showInterestsModal && (
                <EditInterestsModal
                    interests={profile.interests}
                    onSave={(newInterests) => {
                        setProfile((prev) => ({
                            ...prev,
                            interests: newInterests,
                        }));
                        setShowInterestsModal(false);
                    }}
                    onClose={() => setShowInterestsModal(false)}
                />
            )}
            {showPhotoModal && (
                <EditPhotosModal
                    photos={profile.photos}
                    onSave={(newPhotos) => {
                        setProfile((prev) => ({
                            ...prev,
                            photos: newPhotos,
                        }));
                        setShowPhotoModal(false);
                    }}
                    onClose={() => setShowPhotoModal(false)}
                />
            )}
            {showProfilePhotoModal && (
                <EditProfilePhotoModal
                    currentPhoto={profile.profilePhoto}
                    onSave={(newPhoto) => {
                        setProfile((prev) => ({
                            ...prev,
                            profilePhoto: newPhoto,
                        }));
                        setShowProfilePhotoModal(false);
                    }}
                    onClose={() => setShowProfilePhotoModal(false)}
                />
            )}
        </div>
    );
};
const EditBioModal = ({ bio, onSave, onClose }) => {
    const [newBio, setNewBio] = useState(bio);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        onSave(newBio);
        setLoading(false);
    };
    return (
        <ModalWrapper onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                    Chỉnh sửa giới thiệu
                </h3>
                <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] 
                   focus:border-transparent resize-none"
                    rows={4}
                    maxLength={500}
                    placeholder="Viết gì đó về bản thân..."
                />
                <p className="text-sm text-right text-gray-500">
                    {newBio.length}/500
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 transition-colors duration-300 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white
                     rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                     disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader2Icon className="w-5 h-5 animate-spin" />
                        ) : (
                            "Lưu"
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};
const EditInterestsModal = ({ interests, onSave, onClose }) => {
    const [selectedInterests, setSelectedInterests] = useState(interests);
    const [loading, setLoading] = useState(false);
    const popularInterests = [
        "#CafeTối",
        "#DuLịchBụi",
        "#Nhiếp ảnh",
        "#Đọc sách",
        "#Âm nhạc",
        "#Yoga",
        "#Nấu ăn",
        "#Thể thao",
        "#Phim ảnh",
        "#Nghệ thuật",
        "#Du lịch",
        "#Mua sắm",
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        onSave(selectedInterests);
        setLoading(false);
    };
    const toggleInterest = (interest) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };
    return (
        <ModalWrapper onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                    Chỉnh sửa sở thích
                </h3>
                <div className="flex flex-wrap gap-2">
                    {popularInterests.map((interest) => (
                        <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                       ${
                           selectedInterests.includes(interest)
                               ? "bg-[#FF5864] text-white"
                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                       }`}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 transition-colors duration-300 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white
                     rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                     disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader2Icon className="w-5 h-5 animate-spin" />
                        ) : (
                            "Lưu"
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};
const EditPhotosModal = ({ photos, onSave, onClose }) => {
    const [currentPhotos, setCurrentPhotos] = useState(photos);
    const [loading, setLoading] = useState(false);
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentPhotos((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };
    const removePhoto = (index) => {
        setCurrentPhotos((prev) => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        onSave(currentPhotos);
        setLoading(false);
    };
    return (
        <ModalWrapper onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                    Chỉnh sửa ảnh
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {currentPhotos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative aspect-square group"
                        >
                            <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute p-1 text-white transition-opacity duration-300 bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {currentPhotos.length < 6 && (
                        <label className="flex flex-col items-center justify-center transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-gray-50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <CameraIcon className="w-8 h-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">
                                Thêm ảnh
                            </span>
                        </label>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 transition-colors duration-300 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white
                     rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                     disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader2Icon className="w-5 h-5 animate-spin" />
                        ) : (
                            "Lưu"
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};
const EditProfilePhotoModal = ({ currentPhoto, onSave, onClose }) => {
    const [loading, setLoading] = useState(false);
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
                onSave(reader.result);
                setLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <ModalWrapper onClose={onClose}>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                    Cập nhật ảnh đại diện
                </h3>
                <div className="relative aspect-square">
                    <img
                        src={currentPhoto}
                        alt="Current profile photo"
                        className="object-cover w-full h-full rounded-lg"
                    />
                </div>
                <label className="block w-full">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />
                    <div
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white
                       rounded-xl text-center cursor-pointer hover:shadow-lg transition-all duration-300
                       hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader2Icon className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CameraIcon className="w-5 h-5 mr-2" />
                                Chọn ảnh mới
                            </>
                        )}
                    </div>
                </label>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 text-gray-700 transition-colors duration-300 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                    Hủy
                </button>
            </div>
        </ModalWrapper>
    );
};
const ModalWrapper = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl animate-scale-up">
                {children}
            </div>
        </div>
    );
};
export default Profile;

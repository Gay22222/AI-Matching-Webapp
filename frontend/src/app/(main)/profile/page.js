"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CameraIcon, EditIcon, Loader2Icon, XIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMetadata } from "@/hooks/useMetadata";
import axios from "axios";
import { setupAxios } from "@/app/auth/_helpers";
import { showToast } from "@/lib/toast";

setupAxios(axios);

const Profile = () => {
    const { auth, currentUser, refreshUser } = useAuth();
    const { metadata } = useMetadata();
    console.log("Current user:", JSON.stringify(currentUser, null, 2));

    const [showBioModal, setShowBioModal] = useState(false);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const [profile, setProfile] = useState({
        name: "Chưa cập nhật",
        age: "N/A",
        location: "Chưa cập nhật",
        bio: "Chưa có mô tả",
        interests: [],
        photos: [],
        profilePhoto: "/default-avatar.jpg",
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const profileData = useMemo(() => {
        if (!currentUser || !metadata) return null;
        return {
            name: currentUser?.displayName || "Chưa cập nhật",
            age: currentUser?.age || "N/A",
            location: currentUser?.location || "Chưa cập nhật",
            bio: currentUser?.aboutMe || "Chưa có mô tả",
            interests: currentUser?.favorites?.map(
                (favorite) => metadata?.favorites?.find((f) => f.id === favorite)?.value || "N/A"
            ) || [],
            photos: currentUser?.photos
                ?.filter((photo) => !photo.url.startsWith("https://avatars.githubusercontent.com"))
                .map((photo) => ({
                    id: photo.id,
                    url: photo.url.startsWith("http") ? photo.url : `http://localhost:3001${photo.url.toLowerCase()}`,
                    is_profile_pic: photo.is_profile_pic,
                })) || [],
            profilePhoto: currentUser?.photos?.find((photo) => photo.is_profile_pic)?.url
                ? currentUser.photos.find((photo) => photo.is_profile_pic).url.startsWith("http")
                    ? currentUser.photos.find((photo) => photo.is_profile_pic).url
                    : `http://localhost:3001${currentUser.photos.find((photo) => photo.is_profile_pic).url.toLowerCase()}`
                : "/default-avatar.jpg",
        };
    }, [currentUser, metadata]);

    useEffect(() => {
        if (profileData) {
            setProfile(profileData);
            setError(null);
        } else if (!currentUser && auth) {
            setError("Đang tải dữ liệu hồ sơ...");
        } else if (!auth) {
            setError("Vui lòng đăng nhập để xem hồ sơ");
        }
    }, [profileData, currentUser, auth]);

    console.log("Profile state:", JSON.stringify(profile, null, 2));

    if (error && isClient) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg text-gray-600">{error}</p>
                    {!auth && (
                        <button
                            onClick={() => window.location.href = "/auth/login"}
                            className="mt-4 px-6 py-2 bg-[#FF5864] text-white rounded-xl hover:bg-[#FF655B]"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!currentUser && auth && isClient) {
        return (
            <div className="w-full max-w-lg mx-auto py-6 px-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto -mt-16" />
                    <div className="text-center mt-4 px-6">
                        <div className="h-6 bg-gray-200 w-1/2 mx-auto" />
                        <div className="h-4 bg-gray-200 w-1/3 mx-auto mt-2" />
                    </div>
                    <div className="px-6 py-4">
                        <div className="h-4 bg-gray-200 w-1/4" />
                        <div className="h-16 bg-gray-200 mt-2" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto py-6 px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Profile header */}
                <div className="relative h-48 bg-gradient-to-r from-[#FF5864] to-[#FF655B]">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative group">
                            {profile.profilePhoto ? (
                                <img
                                    src={profile.profilePhoto}
                                    alt="Profile"
                                    crossOrigin="anonymous"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                                        e.target.src = "/default-avatar.jpg";
                                    }}
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                                    <span className="text-4xl text-gray-400">?</span>
                                </div>
                            )}
                            <button
                                onClick={() => setShowProfilePhotoModal(true)}
                                className="absolute bottom-2 right-2 bg-[#FF5864] p-2 rounded-full text-white shadow-md hover:scale-110 transition-transform duration-300"
                            >
                                <CameraIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile info */}
                <div className="text-center mt-20 px-6">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}, {profile.age}</h1>
                    <p className="text-gray-500 mt-1">{profile.location}</p>
                </div>

                {/* Bio */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Giới thiệu</h2>
                        <button
                            onClick={() => setShowBioModal(true)}
                            className="text-[#FF5864] hover:scale-110 transition-transform duration-300"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Interests */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Sở thích</h2>
                        <button
                            onClick={() => setShowInterestsModal(true)}
                            className="text-[#FF5864] hover:scale-110 transition-transform duration-300"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-300"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Photos */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Ảnh ({profile.photos.length}/6)</h2>
                        <button
                            onClick={() => setShowPhotoModal(true)}
                            className="text-[#FF5864] hover:scale-110 transition-transform duration-300"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {profile.photos
                            .filter((photo) => photo?.url)
                            .map((photo, index) => (
                                <div key={index} className="relative aspect-square overflow-hidden rounded-xl group">
                                    <img
                                        src={photo.url}
                                        alt={`Photo ${index + 1}`}
                                        crossOrigin="anonymous"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                                            e.target.src = "/default-avatar.jpg";
                                        }}
                                    />
                                </div>
                            ))}
                        {[...Array(6 - profile.photos.filter((photo) => photo?.url).length)].map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                                onClick={() => setShowPhotoModal(true)}
                            >
                                <CameraIcon className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showBioModal && (
                <EditBioModal
                    bio={profile.bio}
                    onSave={(newBio) => {
                        setProfile((prev) => ({ ...prev, bio: newBio }));
                        setShowBioModal(false);
                    }}
                    onClose={() => setShowBioModal(false)}
                />
            )}
            {showInterestsModal && (
                <EditInterestsModal
                    interests={profile.interests}
                    onSave={(newInterests) => {
                        setProfile((prev) => ({ ...prev, interests: newInterests }));
                        setShowInterestsModal(false);
                    }}
                    onClose={() => setShowInterestsModal(false)}
                />
            )}
            {showPhotoModal && (
                <EditPhotosModal
                    photos={profile.photos}
                    onSave={(newPhotos) => {
                        setProfile((prev) => ({ ...prev, photos: newPhotos }));
                        setShowPhotoModal(false);
                    }}
                    onClose={() => setShowPhotoModal(false)}
                />
            )}
            {showProfilePhotoModal && (
                <EditProfilePhotoModal
                    currentPhoto={profile.profilePhoto}
                    onSave={(newPhotoData) => {
                        setProfile((prev) => ({
                            ...prev,
                            profilePhoto: newPhotoData.profilePhoto,
                            photos: newPhotoData.photos,
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
    const { auth, currentUser, refreshUser } = useAuth();
    const [newBio, setNewBio] = useState(bio);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                "http://localhost:3001/api/user/update-profile",
                {
                    user: {
                        id: currentUser.id,
                        aboutMe: newBio,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.access_token}`,
                    },
                }
            );
            await refreshUser();
            onSave(newBio);
            showToast.success("Cập nhật giới thiệu thành công");
        } catch (error) {
            console.error("Error updating bio:", error);
            showToast.error(`Lỗi khi cập nhật giới thiệu: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl animate-slide-up">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa giới thiệu</h3>
                    <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent resize-none"
                        rows={4}
                        maxLength={500}
                        placeholder="Viết gì đó về bản thân..."
                    />
                    <p className="text-sm text-right text-gray-500">{newBio.length}/500</p>
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
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <Loader2Icon className="w-5 h-5 animate-spin" /> : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditInterestsModal = ({ interests, onSave, onClose }) => {
    const { auth, currentUser, refreshUser } = useAuth();
    const { metadata } = useMetadata();
    const [selectedInterests, setSelectedInterests] = useState(interests);
    const [loading, setLoading] = useState(false);
    const popularInterests = metadata?.favorites?.map((f) => f.value) || [
        "#CafeTối", "#DuLịchBụi", "#Nhiếp ảnh", "#Đọc sách", "#Âm nhạc",
        "#Yoga", "#Nấu ăn", "#Thể thao", "#Phim ảnh", "#Nghệ thuật",
        "#Du lịch", "#Mua sắm",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Chuyển đổi selectedInterests (chuỗi) thành mảng ID
            const favoriteIds = selectedInterests
                .map((interest) => metadata?.favorites?.find((f) => f.value === interest)?.id)
                .filter((id) => id !== undefined);

            await axios.put(
                "http://localhost:3001/api/user/update-profile",
                {
                    user: {
                        id: currentUser.id,
                        favorites: favoriteIds,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.access_token}`,
                    },
                }
            );
            await refreshUser();
            onSave(selectedInterests);
            showToast.success("Cập nhật sở thích thành công");
        } catch (error) {
            console.error("Error updating interests:", error);
            showToast.error(`Lỗi khi cập nhật sở thích: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl animate-slide-up">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa sở thích</h3>
                    <div className="flex flex-wrap gap-2">
                        {popularInterests.map((interest) => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => toggleInterest(interest)}
                                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
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
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <Loader2Icon className="w-5 h-5 animate-spin" /> : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditPhotosModal = ({ photos, onSave, onClose }) => {
    const { auth, currentUser, refreshUser } = useAuth();
    const [currentPhotos, setCurrentPhotos] = useState(photos);
    const [loading, setLoading] = useState(false);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("bioId", currentUser?.bioId);

                const response = await axios.post(
                    "http://localhost:3001/api/upload/single",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.access_token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const newPhoto = response.data.photo;
                setCurrentPhotos((prev) => [
                    ...prev,
                    {
                        id: newPhoto.id,
                        url: newPhoto.url.startsWith("http")
                            ? newPhoto.url
                            : `http://localhost:3001${newPhoto.url.toLowerCase()}`,
                        is_profile_pic: newPhoto.is_profile_pic,
                    },
                ]);
                await refreshUser();
                showToast.success("Tải ảnh lên thành công");
                setLoading(false);
            } catch (error) {
                console.error("Error uploading photo:", error);
                showToast.error(`Lỗi khi upload ảnh: ${error.response?.data?.message || error.message}`);
                setLoading(false);
            }
        }
    };

    const removePhoto = async (index) => {
        const photoToRemove = currentPhotos[index];
        if (!photoToRemove?.id) {
            console.warn("Photo ID is missing, cannot delete");
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`http://localhost:3001/api/upload/${photoToRemove.id}`, {
                headers: {
                    Authorization: `Bearer ${auth?.access_token}`,
                },
            });
            setCurrentPhotos((prev) => prev.filter((_, i) => i !== index));
            showToast.success("Xóa ảnh thành công");
            await refreshUser();
        } catch (error) {
            console.error("Error deleting photo:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            showToast.error(`Lỗi khi xóa ảnh: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (currentPhotos.length > 0) {
                await axios.put(
                    "http://localhost:3001/api/user/update-profile",
                    {
                        user: {
                            id: currentUser.id,
                            photos: currentPhotos.map((photo) => ({
                                id: photo.id,
                                url: photo.url,
                                is_profile_pic: photo.is_profile_pic,
                            })),
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.access_token}`,
                        },
                    }
                );
                await refreshUser();
                onSave(currentPhotos);
                showToast.success("Cập nhật ảnh thành công");
            } else {
                // Nếu không còn ảnh, gửi danh sách rỗng
                await axios.put(
                    "http://localhost:3001/api/user/update-profile",
                    {
                        user: {
                            id: currentUser.id,
                            photos: [],
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.access_token}`,
                        },
                    }
                );
                await refreshUser();
                onSave([]);
                showToast.success("Cập nhật ảnh thành công");
            }
        } catch (error) {
            console.error("Error saving photos:", error);
            showToast.error(`Lỗi khi lưu ảnh: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl animate-slide-up">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa ảnh</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {currentPhotos.map((photo, index) => (
                            <div key={index} className="relative aspect-square group">
                                <img
                                    src={photo.url}
                                    alt={`Photo ${index + 1}`}
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                                        e.target.src = "/default-avatar.jpg";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                                {photo.is_profile_pic && (
                                    <span className="absolute top-2 left-2 bg-[#FF5864] text-white text-xs px-2 py-1 rounded-full">
                                        Đại diện
                                    </span>
                                )}
                            </div>
                        ))}
                        {currentPhotos.length < 6 && (
                            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <CameraIcon className="w-8 h-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">Thêm ảnh</span>
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
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <Loader2Icon className="w-5 h-5 animate-spin" /> : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditProfilePhotoModal = ({ currentPhoto, onSave, onClose }) => {
    const { auth, currentUser, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!currentUser?.bioId) {
                showToast.error("Không thể upload ảnh: Thiếu thông tin người dùng");
                setLoading(false);
                return;
            }
            if (!auth?.access_token) {
                showToast.error("Không thể upload ảnh: Vui lòng đăng nhập lại");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("bioId", currentUser.bioId);
                formData.append("isProfilePic", "true");

                const response = await axios.post(
                    "http://localhost:3001/api/upload/single",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.access_token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const newPhoto = response.data.photo;
                const newPhotoUrl = newPhoto.url.startsWith("http")
                    ? newPhoto.url
                    : `http://localhost:3001${newPhoto.url.toLowerCase()}`;

                // Cập nhật state với ảnh đại diện mới và danh sách ảnh
                onSave({
                    profilePhoto: newPhotoUrl,
                    photos: [
                        ...currentUser.photos
                            .filter((photo) => photo.id !== newPhoto.id)
                            .map((photo) => ({
                                id: photo.id,
                                url: photo.url.startsWith("http") ? photo.url : `http://localhost:3001${photo.url.toLowerCase()}`,
                                is_profile_pic: false,
                            })),
                        {
                            id: newPhoto.id,
                            url: newPhotoUrl,
                            is_profile_pic: true,
                        },
                    ],
                });
                await refreshUser();
                showToast.success("Cập nhật ảnh đại diện thành công");
                setLoading(false);
            } catch (error) {
                console.error("Error uploading profile photo:", error);
                showToast.error(`Lỗi khi upload ảnh: ${error.response?.data?.message || error.message}`);
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl animate-slide-up">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Cập nhật ảnh đại diện</h3>
                    {currentPhoto && (
                        <div className="relative aspect-square">
                            <img
                                src={currentPhoto}
                                alt="Current profile photo"
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                    console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                                    e.target.src = "/default-avatar.jpg";
                                }}
                            />
                        </div>
                    )}
                    <label className="block">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                        <div className="w-full px-4 py-3 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-xl text-center cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center justify-center">
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
            </div>
        </div>
    );
};

export default Profile;
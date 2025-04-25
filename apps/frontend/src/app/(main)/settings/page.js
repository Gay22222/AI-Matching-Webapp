"use client";
import React, { useState } from "react";
import {
    BellIcon,
    CompassIcon,
    CrownIcon,
    HeartIcon,
    LockIcon,
    LogOutIcon,
    ShieldIcon,
    UserIcon,
    CameraIcon,
    Loader2Icon,
    XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import Link from "next/link";
const Settings = () => {
    const router = useRouter();
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "Linh Nguyễn",
        username: "@linh.nguyen",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3",
    });
    const handlePhotoChange = (newPhoto) => {
        setProfileData((prev) => ({
            ...prev,
            photo: newPhoto,
        }));
    };
    const handlePhotoClick = () => {
        setShowPhotoModal(true);
    };
    const handleProfileEdit = () => {
        router.push("/profile-setup");
    };

    const handleLogout = () => {
        router.push("/auth/login");
    };
    const settingSections = [
        {
            title: "Tài khoản",
            items: [
                {
                    icon: UserIcon,
                    label: "Thông tin cá nhân",
                    description: "Cập nhật thông tin của bạn",
                    highlight: true,
                    onClick: handleProfileEdit,
                },
                {
                    icon: CrownIcon,
                    label: "DateViet Premium",
                    description: "Xem các tính năng cao cấp",
                    badge: "Mới",
                    gradient: true,
                    onClick: () => router.push("/premium"), // Updated navigation
                },
            ],
        },
        {
            title: "Ứng dụng",
            items: [
                {
                    icon: CompassIcon,
                    label: "Tùy chọn khám phá",
                    description: "Khoảng cách, độ tuổi, giới tính",
                },
                {
                    icon: BellIcon,
                    label: "Thông báo",
                    description: "Tin nhắn, lượt thích, kết đôi",
                },
                {
                    icon: LockIcon,
                    label: "Quyền riêng tư",
                    description: "Kiểm soát dữ liệu của bạn",
                },
            ],
        },
        {
            title: "Khác",
            items: [
                {
                    icon: ShieldIcon,
                    label: "An toàn & Bảo mật",
                    description: "Mật khẩu, xác thực 2 lớp",
                },
                {
                    icon: HeartIcon,
                    label: "Giới thiệu bạn bè",
                    description: "Nhận 1 tháng Premium miễn phí",
                    badge: "Ưu đãi",
                },
            ],
        },
    ];
    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-[#FF5864] to-[#FF655B]">
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="relative px-6 pb-6">
                        <div className="flex items-center -mt-12">
                            <div className="relative group">
                                <img
                                    src={profileData.photo}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover
                           transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                    onClick={handlePhotoClick}
                                    className="absolute bottom-0 right-0 bg-[#FF5864] p-2 rounded-full text-white
                           shadow-lg transition-transform duration-300 hover:scale-110"
                                >
                                    <CameraIcon className="h-4 w-4" />
                                </button>
                                <div
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                              transition-opacity duration-300 rounded-2xl flex items-center justify-center"
                                >
                                    <span className="text-white text-sm font-medium">
                                        Thay đổi ảnh
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4 mt-12">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {profileData.name}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {profileData.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {settingSections.map((section, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {section.title}
                            </h3>
                            <div className="space-y-3">
                                {section.items.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item.onClick}
                                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-300
                            ${
                                item.gradient
                                    ? "bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white"
                                    : "hover:bg-gray-50"
                            }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg ${
                                                item.gradient
                                                    ? "bg-white/20"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            <item.icon
                                                className={`h-5 w-5 ${
                                                    item.gradient
                                                        ? "text-white"
                                                        : "text-gray-600"
                                                }`}
                                            />
                                        </div>
                                        <div className="ml-4 flex-1 text-left">
                                            <p
                                                className={`font-medium ${
                                                    item.gradient
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {item.label}
                                            </p>
                                            <p
                                                className={`text-sm ${
                                                    item.gradient
                                                        ? "text-white/80"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                        {item.badge && (
                                            <span
                                                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${
                                    item.gradient
                                        ? "bg-white/20 text-white"
                                        : "bg-rose-100 text-rose-600"
                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white text-gray-600 rounded-2xl shadow-lg p-4 flex items-center justify-center font-medium 
                   hover:bg-gray-50 transition-colors duration-300"
                >
                    <LogOutIcon className="h-5 w-5 mr-2" />
                    Đăng xuất
                </button>
                <div className="text-center text-sm text-gray-500">
                    <p>DateViet v1.0.0</p>
                </div>
            </div>
            {showPhotoModal && (
                <PhotoUploadModal
                    currentPhoto={profileData.photo}
                    onSave={(newPhoto) => {
                        handlePhotoChange(newPhoto);
                        setShowPhotoModal(false);
                    }}
                    onClose={() => setShowPhotoModal(false)}
                />
            )}
        </div>
    );
};
const PhotoUploadModal = ({ currentPhoto, onSave, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(currentPhoto);
    const [isDragging, setIsDragging] = useState(false);
    const handlePhotoUpload = async (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn file ảnh");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Kích thước ảnh không được vượt quá 5MB");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setPreview(reader.result);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                onSave(reader.result);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError("Có lỗi xảy ra khi tải ảnh lên");
        } finally {
            setLoading(false);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handlePhotoUpload(file);
    };
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handlePhotoUpload(file);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-md p-6 animate-scale-up">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Cập nhật ảnh đại diện
                </h3>
                {preview && (
                    <div className="relative mb-4 aspect-square rounded-xl overflow-hidden">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {!loading && (
                            <button
                                onClick={() => setPreview(null)}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white
                         hover:bg-red-600 transition-colors duration-300"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
                {!preview && (
                    <label
                        className={`block w-full aspect-square rounded-xl border-2 border-dashed
                     ${
                         isDragging
                             ? "border-[#FF5864] bg-[#FF5864]/5"
                             : "border-gray-300 hover:border-[#FF5864]"
                     }
                     transition-colors cursor-pointer bg-gray-50`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                        />
                        <div className="h-full flex flex-col items-center justify-center p-6">
                            <CameraIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 text-center">
                                Kéo thả ảnh vào đây hoặc click để chọn
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Hỗ trợ: JPG, PNG (Tối đa: 5MB)
                            </p>
                        </div>
                    </label>
                )}
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700
                     hover:bg-gray-50 transition-colors duration-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onSave(preview)}
                        disabled={loading || !preview}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white
                     rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                     disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2Icon className="h-5 w-5 animate-spin" />
                        ) : (
                            "Lưu thay đổi"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Settings;

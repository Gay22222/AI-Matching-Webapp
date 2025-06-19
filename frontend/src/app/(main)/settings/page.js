"use client";

import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const { auth, currentUser, logout } = useAuth();
  console.log("auth", auth);

  const router = useRouter();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.display_name,
    username: currentUser?.username,
    photo: "/default-avatar.jpg",
  });

  // Hàm chuẩn hóa URL ảnh
  const normalizePhotoUrl = (photo) => {
    let url;
    // Xử lý photo là mảng (từ Prisma)
    if (Array.isArray(photo)) {
      if (photo.length > 0 && photo[0]?.url && typeof photo[0].url === 'string') {
        url = photo[0].url;
      }
    }
    // Xử lý photo là object
    else if (photo && typeof photo === 'object' && photo.url && typeof photo.url === 'string') {
      url = photo.url;
    }
    // Xử lý photo là chuỗi trực tiếp
    else if (typeof photo === 'string' && photo) {
      url = photo;
    }

    // Kiểm tra url hợp lệ
    if (!url || typeof url !== 'string') {
      console.warn("Invalid or missing photo URL", { photo, url });
      return "/default-avatar.jpg";
    }

    // Chuẩn hóa URL
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url.toLowerCase()}`;
  };

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser?.displayName || currentUser?.display_name || "Chưa cập nhật",
        //username: currentUser?.username || "Chưa cập nhật",
        photo: normalizePhotoUrl(currentUser?.photo || currentUser?.photos?.find((p) => p.is_profile_pic)),
      });
    }
  }, [currentUser]);

  const handlePhotoChange = (newPhoto) => {
    setProfileData((prev) => ({
      ...prev,
      photo: normalizePhotoUrl(newPhoto),
    }));
  };

  const handlePhotoClick = () => {
    setShowPhotoModal(true);
  };

  const handleProfileEdit = () => {
    router.push("/profile-setup");
  };

  const handleLogout = () => {
    logout();
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
          onClick: () => router.push("/premium"),
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
    <div className="w-full max-w-md p-4 mx-auto">
      <div className="space-y-6">
        <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
          <div className="relative h-32 bg-gradient-to-r from-[#FF5864] to-[#FF655B]">
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex items-center -mt-12">
              <div className="relative group">
                <img
                  src={profileData.photo}
                  alt="Profile"
                  className="object-cover w-24 h-24 transition-transform duration-300 border-4 border-white shadow-lg rounded-2xl group-hover:scale-105"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
                <button
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 bg-[#FF5864] p-2 rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100 rounded-2xl">
                  <span className="text-sm font-medium text-white">
                    Thay đổi ảnh
                  </span>
                </div>
              </div>
              <div className="mt-12 ml-4">
                <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-sm text-gray-600">{profileData.username}</p>
              </div>
            </div>
          </div>
        </div>
        {settingSections.map((section, idx) => (
          <div
            key={idx}
            className="overflow-hidden bg-white shadow-lg rounded-2xl"
          >
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{section.title}</h3>
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-300
                      ${item.gradient ? "bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white" : "hover:bg-gray-50"}`}
                  >
                    <div
                      className={`p-2 rounded-lg ${item.gradient ? "bg-white/20" : "bg-gray-100"}`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${item.gradient ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <div className="flex-1 ml-4 text-left">
                      <p
                        className={`font-medium ${item.gradient ? "text-white" : "text-gray-900"}`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-sm ${item.gradient ? "text-white/80" : "text-gray-500"}`}
                      >
                        {item.description}
                      </p>
                    </div>
                    {item.badge && (
                      <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.gradient ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"}`}
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
          className="flex items-center justify-center w-full p-4 font-medium text-gray-600 transition-colors duration-300 bg-white shadow-lg rounded-2xl hover:bg-gray-50"
        >
          <LogOutIcon className="w-5 h-5 mr-2" />
          Đăng xuất
        </button>
        <div className="text-sm text-center text-gray-500">
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

  // Chuẩn hóa URL ảnh
  const normalizePhotoUrl = (photo) => {
    if (!photo || typeof photo !== 'string') {
      console.warn("Invalid or missing photo URL", { photo });
      return "/default-avatar.jpg";
    }
    return photo.startsWith("http") ? photo : `${process.env.NEXT_PUBLIC_API_URL}${photo.toLowerCase()}`;
  };

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
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl animate-scale-up">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          Cập nhật ảnh đại diện
        </h3>
        {preview && (
          <div className="relative mb-4 overflow-hidden aspect-square rounded-xl">
            <img
              src={normalizePhotoUrl(preview)}
              alt="Preview"
              className="object-cover w-full h-full"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                e.target.src = "/default-avatar.jpg";
              }}
            />
            {!loading && (
              <button
                onClick={() => setPreview(null)}
                className="absolute p-1 text-white transition-colors duration-300 bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {!preview && (
          <label
            className={`block w-full aspect-square rounded-xl border-2 border-dashed
              ${isDragging ? "border-[#FF5864] bg-[#FF5864]/5" : "border-gray-300 hover:border-[#FF5864]"}
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
            <div className="flex flex-col items-center justify-center h-full p-6">
              <CameraIcon className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-sm text-center text-gray-600">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Hỗ trợ: JPG, PNG (Tối đa: 5MB)
              </p>
            </div>
          </label>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 transition-colors duration-300 border border-gray-300 rounded-xl hover:bg-gray-50"
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
              <Loader2Icon className="w-5 h-5 animate-spin" />
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

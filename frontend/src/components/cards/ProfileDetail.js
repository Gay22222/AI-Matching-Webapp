import React, { useState } from "react";
import Image from "next/image";
import { useMetadata } from "@/hooks/useMetadata";
import { ArrowLeftIcon } from "lucide-react";

const ProfileDetail = ({ profile: initialProfile, onBack }) => {
    const { metadata, isLoading: metadataLoading } = useMetadata();
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [imageErrors, setImageErrors] = useState({});

    // Hàm chuẩn hóa URL ảnh
    const normalizePhotoUrl = (url) => {
        if (!url) {
            console.warn("Photo URL is empty, using default avatar");
            return "/default-avatar.jpg";
        }
        if (url.startsWith("http")) {
            return url; // Giữ nguyên URL tuyệt đối
        }
        // Loại bỏ /uploads lặp lại và chuẩn hóa đường dẫn
        let cleanUrl = url.replace(/^\/*uploads\/*/i, "");
        cleanUrl = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
        const finalUrl = `${process.env.NEXT_PUBLIC_UPLOADS_URL}${cleanUrl.toLowerCase()}`;
        console.debug(`Normalized photo URL: ${finalUrl}`);
        return finalUrl;
    };

    // Kiểm tra xem URL có phải từ localhost:3001 không
    const isLocalImage = (url) => {
        return url && url.startsWith(process.env.NEXT_PUBLIC_API_URL);
    };

    // Chuẩn hóa profile để đảm bảo URL ảnh đúng
    const profile = {
        ...initialProfile,
        photos: Array.isArray(initialProfile.photos)
            ? initialProfile.photos.map((photo) => ({
                  ...photo,
                  url: normalizePhotoUrl(photo.url),
              }))
            : [],
    };

    console.log("Profile data:", JSON.stringify(profile, null, 2));
    console.log("Metadata:", JSON.stringify(metadata, null, 2));

    const getMetadataName = (id, type) => {
        if (metadataLoading) return "Đang tải...";
        if (!metadata || !id) {
            console.warn(`Missing metadata or ID for type: ${type}, id: ${id}`);
            return id ? `ID: ${id}` : "Chưa cập nhật";
        }
        const item = metadata[type]?.find((m) => m.id === id);
        if (!item) {
            console.warn(`No matching item for type: ${type}, id: ${id}`);
            return id ? `ID: ${id}` : "Chưa cập nhật";
        }
        return item.name || item.value || "Chưa cập nhật";
    };

    const profilePhoto = profile.photos?.length > 0
        ? normalizePhotoUrl(
              profile.photos.find((photo) => photo.is_profile_pic)?.url ||
              profile.photos[currentPhoto]?.url
          )
        : "/default-avatar.jpg";

    const handleImageError = (photoId) => {
        console.error(`Failed to load image for photo ID: ${photoId}`);
        setImageErrors((prev) => ({ ...prev, [photoId]: true }));
    };

    if (metadataLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FF5864]"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="relative">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
                >
                    <ArrowLeftIcon className="w-5 h-5 text-gray-800" />
                </button>
                {isLocalImage(profilePhoto) && !imageErrors["profile"] ? (
                    <Image
                        src={profilePhoto}
                        alt={`${profile.name}'s profile`}
                        width={512}
                        height={320}
                        className="w-full h-80 object-cover"
                        onError={() => handleImageError("profile")}
                        placeholder="blur"
                        blurDataURL="/default-avatar.jpg"
                    />
                ) : (
                    <img
                        src={imageErrors["profile"] ? "/default-avatar.jpg" : profilePhoto}
                        alt={`${profile.name}'s profile`}
                        className="w-full h-80 object-cover"
                        onError={() => handleImageError("profile")}
                    />
                )}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {profile?.photos?.map((photo, index) => (
                        <button
                            key={photo.id}
                            onClick={() => setCurrentPhoto(index)}
                            className={`transition-all duration-200 ease-out ${
                                index === currentPhoto
                                    ? "w-6 h-2 bg-white rounded-full"
                                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {profile.name}, {profile.age}
                    </h2>
                    <p className="text-gray-600">{profile.location || "Chưa cập nhật"}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.favorites?.map((favId, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {getMetadataName(favId, "favorites")}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Giới thiệu</h3>
                    <p className="text-gray-600">{profile.aboutMe || "Chưa có mô tả"}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span className="text-sm text-gray-500">Giới tính:</span>
                            <p className="text-gray-800">{profile.gender || "Chưa cập nhật"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Tìm kiếm:</span>
                            <p className="text-gray-800">{getMetadataName(profile.searchingFor, "searchingFor")}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Chiều cao:</span>
                            <p className="text-gray-800">{profile.height ? `${profile.height} cm` : "Chưa cập nhật"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Ngôn ngữ:</span>
                            <p className="text-gray-800">{getMetadataName(profile.languageId, "languages")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Tôn giáo:</span>
                            <p className="text-gray-800">{getMetadataName(profile.religionId, "religions")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Nghề nghiệp:</span>
                            <p className="text-gray-800">{getMetadataName(profile.careerId, "careers")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Học vấn:</span>
                            <p className="text-gray-800">{getMetadataName(profile.educationId, "educations")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Cung hoàng đạo:</span>
                            <p className="text-gray-800">{getMetadataName(profile.zodiacId, "zodiacs")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Tính cách:</span>
                            <p className="text-gray-800">{getMetadataName(profile.characterId, "characters")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Phong cách giao tiếp:</span>
                            <p className="text-gray-800">{getMetadataName(profile.communicateStyleId, "communicateStyles")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Ngôn ngữ yêu thương:</span>
                            <p className="text-gray-800">{getMetadataName(profile.loveLanguageId, "loveLanguages")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Kế hoạch gia đình:</span>
                            <p className="text-gray-800">{getMetadataName(profile.futureFamilyId, "futureFamilies")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Xu hướng tình dục:</span>
                            <p className="text-gray-800">{getMetadataName(profile.sexualOrientationId, "sexualOrientations")}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Lối sống</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Uống rượu:</span>
                            <p className="text-gray-800">{profile.drink ? "Có" : profile.drink === false ? "Không" : "Chưa cập nhật"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Hút thuốc:</span>
                            <p className="text-gray-800">{profile.smoke ? "Có" : profile.smoke === false ? "Không" : "Chưa cập nhật"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Tập luyện:</span>
                            <p className="text-gray-800">{profile.train ? "Có" : profile.train === false ? "Không" : "Chưa cập nhật"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Thú cưng:</span>
                            <p className="text-gray-800">{getMetadataName(profile.petId, "pets")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Chế độ ăn:</span>
                            <p className="text-gray-800">{getMetadataName(profile.dietId, "diets")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Thói quen ngủ:</span>
                            <p className="text-gray-800">{getMetadataName(profile.sleepId, "sleeps")}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Mạng xã hội:</span>
                            <p className="text-gray-800">{getMetadataName(profile.snuId, "snus")}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sở thích</h3>
                    {profile.favorites?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.favorites.map((favId, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                    {getMetadataName(favId, "favorites")}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Chưa có sở thích nào được liệt kê</p>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ảnh</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {profile.photos?.length > 0 ? (
                            profile.photos.map((photo, idx) => (
                                isLocalImage(photo.url) && !imageErrors[photo.id] ? (
                                    <Image
                                        key={photo.id}
                                        src={photo.url}
                                        alt={`Photo ${idx + 1}`}
                                        width={96}
                                        height={96}
                                        className="w-full h-24 object-cover rounded-lg"
                                        onError={() => handleImageError(photo.id)}
                                        placeholder="blur"
                                        blurDataURL="/default-avatar.jpg"
                                    />
                                ) : (
                                    <img
                                        key={photo.id}
                                        src={imageErrors[photo.id] ? "/default-avatar.jpg" : photo.url}
                                        alt={`Photo ${idx + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                        onError={() => handleImageError(photo.id)}
                                    />
                                )
                            ))
                        ) : (
                            <p className="text-gray-600">Chưa có ảnh nào</p>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Mục tiêu mối quan hệ</h3>
                    <p className="text-gray-600">{getMetadataName(profile.searchingFor, "searchingFor")}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;

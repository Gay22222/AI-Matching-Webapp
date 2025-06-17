import React from "react";
import { ImageIcon, PlusIcon } from "lucide-react";

const PhotoUpload = ({ formData, setFormData }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file.type.match("image.*")) {
      alert("Vui lòng chỉ chọn file hình ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 5MB");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, reader.result],
          photoFiles: [...prev.photoFiles, file],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoFiles: prev.photoFiles.filter((_, i) => i !== index),
    }));
  };

  // Hàm chuẩn hóa URL ảnh
  const normalizePhotoUrl = (photo, photoBase64) => {
    if (!photo) {
      console.warn("Photo is missing", { photo, photoBase64 });
      return "/default-avatar.jpg";
    }
    if (photo instanceof File) {
      return URL.createObjectURL(photo);
    }
    if (typeof photo === "string") {
      return photo.startsWith("http") ? photo : `http://localhost:3001${photo.toLowerCase()}`;
    }
    return photoBase64 || "/default-avatar.jpg";
  };

  console.log(formData.photoFiles);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-4 text-sm text-gray-600">
          Thêm ít nhất 2 ảnh để tiếp tục. Chọn ảnh đẹp nhất của bạn!
        </p>
        <div className="grid lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => {
            const photo = formData.photoFiles[index];
            const photoBase64 = formData.photos[index];
            console.log(photo, "photo", index);

            return (
              <div
                key={index + 1}
                className="relative overflow-hidden aspect-square rounded-xl"
              >
                {photo ? (
                  <div className="relative h-full group">
                    <img
                      src={normalizePhotoUrl(photo, photoBase64)}
                      alt={`Photo ${index + 1}`}
                      className="object-cover w-full h-full order-2"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || 'unknown'}`);
                        e.target.src = "/default-avatar.jpg";
                      }}
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute inset-0 flex items-center justify-center text-white transition-opacity opacity-0 bg-black/50 group-hover:opacity-100"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full transition-colors border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <PlusIcon className="w-8 h-8 text-gray-400" />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
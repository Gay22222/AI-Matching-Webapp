import React from "react";
import { ImageIcon, PlusIcon } from "lucide-react";
const PhotoUpload = ({ formData, setFormData }) => {
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    photos: [...prev.photos, reader.result],
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    const removePhoto = (index) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };
    return (
        <div className="space-y-6">
            <div>
                <p className="mb-4 text-sm text-gray-600">
                    Thêm ít nhất 2 ảnh để tiếp tục. Chọn ảnh đẹp nhất của bạn!
                </p>
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => {
                        const photo = formData.photos[index];
                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden aspect-square rounded-xl"
                            >
                                {photo ? (
                                    <div className="relative h-full group">
                                        <img
                                            src={photo}
                                            alt={`Photo ${index + 1}`}
                                            className="object-cover w-full h-full"
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
                                        {index === 0 ? (
                                            <div className="text-center">
                                                <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                                                <span className="block mt-2 text-sm text-gray-500">
                                                    Ảnh chính
                                                </span>
                                            </div>
                                        ) : (
                                            <PlusIcon className="w-8 h-8 text-gray-400" />
                                        )}
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

import React from "react";
const BioInterests = ({ formData, setFormData }) => {
    const popularInterests = [
        "Cà phê",
        "Du lịch",
        "Âm nhạc",
        "Đọc sách",
        "Nấu ăn",
        "Thể thao",
        "Nhiếp ảnh",
        "Yoga",
        "Phim ảnh",
        "Mua sắm",
        "Chơi game",
        "Nghệ thuật",
    ];
    const handleBioChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            bio: e.target.value,
        }));
    };
    const toggleInterest = (interest) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };
    return (
        <div className="space-y-6">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Giới thiệu bản thân
                </label>
                <textarea
                    value={formData.bio}
                    onChange={handleBioChange}
                    placeholder="Hãy viết vài điều về bản thân..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] 
                   focus:border-transparent resize-none"
                    rows={4}
                    maxLength={500}
                />
                <p className="mt-2 text-sm text-right text-gray-500">
                    {formData.bio.length}/500
                </p>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Sở thích của bạn
                </label>
                <p className="mb-4 text-sm text-gray-500">
                    Chọn các sở thích để tìm người phù hợp với bạn
                </p>
                <div className="flex flex-wrap gap-2">
                    {popularInterests.map((interest) => (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                       ${
                           formData.interests.includes(interest)
                               ? "bg-[#FF5864] text-white"
                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                       }`}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default BioInterests;

import React from "react";
import { CrownIcon } from "lucide-react";
const BasicInfo = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <div className="space-y-6">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Tên của bạn
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên của bạn"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Ngày sinh
                </label>
                <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Giới tính
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {["Nam", "Nữ", "Khác"].map((gender) => (
                        <button
                            key={gender}
                            type="button"
                            onClick={() =>
                                handleChange({
                                    target: {
                                        name: "gender",
                                        value: gender,
                                    },
                                })
                            }
                            className={`py-3 px-4 rounded-xl border ${
                                formData.gender === gender
                                    ? "border-[#FF5864] bg-[#FF5864]/5 text-[#FF5864]"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Độ Tuổi Ưa Thích
                </label>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">18</span>
                    <span className="text-sm text-gray-500">32</span>
                </div>
                <input
                    type="range"
                    min="18"
                    max="32"
                    value={formData.ageRange || 25}
                    onChange={(e) =>
                        handleChange({
                            target: {
                                name: "ageRange",
                                value: e.target.value,
                            },
                        })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div className="p-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl">
                <div className="flex items-center gap-3">
                    <CrownIcon className="w-6 h-6 text-white" />
                    <div>
                        <h3 className="font-semibold text-white">
                            Tinder Gold™
                        </h3>
                        <p className="text-sm text-white/80">
                            Các lựa chọn tiêu chí giúp hiển thị những người hợp
                            gu của bạn
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BasicInfo;

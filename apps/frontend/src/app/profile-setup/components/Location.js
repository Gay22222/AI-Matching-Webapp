import React from "react";
import { MapPinIcon } from "lucide-react";
const Location = ({ formData, setFormData }) => {
    const handleLocationChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            location: e.target.value,
        }));
    };
    const handleRadiusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            searchRadius: parseInt(e.target.value),
        }));
    };
    return (
        <div className="space-y-6">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Vị trí của bạn
                </label>
                <div className="relative">
                    <MapPinIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                    <input
                        type="text"
                        value={formData.location}
                        onChange={handleLocationChange}
                        placeholder="Nhập địa chỉ của bạn"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 
                     focus:ring-[#FF5864] focus:border-transparent"
                    />
                </div>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Bán kính tìm kiếm
                </label>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={formData.searchRadius}
                        onChange={handleRadiusChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-[#FF5864]"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">1 km</span>
                        <span className="text-sm font-medium text-gray-700">
                            {formData.searchRadius} km
                        </span>
                        <span className="text-sm text-gray-500">100 km</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                    DateViet sẽ sử dụng vị trí của bạn để tìm kiếm những người
                    phù hợp trong khu vực. Bạn có thể thay đổi cài đặt này sau.
                </p>
            </div>
        </div>
    );
};
export default Location;

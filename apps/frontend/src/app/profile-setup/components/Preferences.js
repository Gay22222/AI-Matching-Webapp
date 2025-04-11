import React, { useState } from "react";
import {
    MoonIcon,
    GraduationCapIcon,
    HomeIcon,
    HeartIcon,
    WineIcon,
    DumbbellIcon,
    UtensilsIcon,
    GlobeIcon,
    BedIcon,
    PawPrintIcon,
    BoxIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CheckIcon,
} from "lucide-react";
const preferenceOptions = {
    "Cung Hoàng Đạo": [
        "Bạch Dương",
        "Kim Ngưu",
        "Song Tử",
        "Cự Giải",
        "Sư Tử",
        "Xử Nữ",
        "Thiên Bình",
        "Bọ Cạp",
        "Nhân Mã",
        "Ma Kết",
        "Bảo Bình",
        "Song Ngư",
    ],
    "Giáo dục": [
        "Trung học",
        "Cao đẳng",
        "Đại học",
        "Thạc sĩ",
        "Tiến sĩ",
        "Đang học",
    ],
    "Gia đình tương lai": [
        "Muốn có con",
        "Không muốn có con",
        "Chưa quyết định",
        "Đã có con",
    ],
    "Kiểu Tính Cách": [
        "INTJ",
        "INTP",
        "ENTJ",
        "ENTP",
        "INFJ",
        "INFP",
        "ENFJ",
        "ENFP",
        "ISTJ",
        "ISFJ",
        "ESTJ",
        "ESFJ",
        "ISTP",
        "ISFP",
        "ESTP",
        "ESFP",
    ],
    "Về việc uống bia rượu": [
        "Không bao giờ",
        "Hiếm khi",
        "Thỉnh thoảng",
        "Thường xuyên",
    ],
    "Bạn có hay hút thuốc không?": [
        "Không bao giờ",
        "Thỉnh thoảng",
        "Thường xuyên",
        "Đang cố bỏ thuốc",
    ],
    "Tập luyện": [
        "Hàng ngày",
        "3-4 lần/tuần",
        "1-2 lần/tuần",
        "Hiếm khi",
        "Không bao giờ",
    ],
    "Chế độ ăn uống": [
        "Tất cả",
        "Chay",
        "Thuần chay",
        "Kosher",
        "Halal",
        "Keto",
        "Ăn kiêng",
    ],
    "Truyền thông xã hội": [
        "Rất tích cực",
        "Thỉnh thoảng",
        "Hiếm khi",
        "Không sử dụng",
    ],
    "Thói quen ngủ": [
        "Chim sớm",
        "Cú đêm",
        "Ngủ sớm dậy sớm",
        "Không có thói quen cụ thể",
    ],
    "Thú cưng": [
        "Có chó",
        "Có mèo",
        "Cả chó và mèo",
        "Thú cưng khác",
        "Không có thú cưng",
        "Dị ứng với thú cưng",
    ],
};
const PreferenceItem = ({
    icon: Icon,
    label,
    onClick,
    selected,
    expanded,
    selectedOption,
    onToggleExpand,
}) => (
    <div className="space-y-2">
        <button
            onClick={onToggleExpand}
            className={`flex items-center justify-between w-full p-4 rounded-xl border 
                ${
                    selected
                        ? "border-[#FF5864] bg-[#FF5864]/5"
                        : "border-gray-300"
                } 
                hover:border-gray-400 transition-colors`}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                    <span className="text-gray-900">{label}</span>
                    {selectedOption && (
                        <p className="text-sm text-gray-500">
                            {selectedOption}
                        </p>
                    )}
                </div>
            </div>
            {expanded ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
        </button>
        {expanded && (
            <div className="p-3 ml-12 space-y-2 bg-gray-50 rounded-xl animate-scale-up">
                {preferenceOptions[label].map((option) => (
                    <button
                        key={option}
                        onClick={() => onClick(option)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg
                     ${
                         selectedOption === option
                             ? "bg-[#FF5864] text-white"
                             : "hover:bg-gray-100"
                     }
                     transition-colors duration-200`}
                    >
                        <span>{option}</span>
                        {selectedOption === option && (
                            <CheckIcon className="w-4 h-4 text-white" />
                        )}
                    </button>
                ))}
            </div>
        )}
    </div>
);
const Preferences = ({ formData, setFormData }) => {
    const [expandedItem, setExpandedItem] = useState(null);
    const handleOptionSelect = (preference, option) => {
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [preference]: option,
            },
        }));
    };
    const preferences = [
        {
            icon: MoonIcon,
            label: "Cung Hoàng Đạo",
        },
        {
            icon: GraduationCapIcon,
            label: "Giáo dục",
        },
        {
            icon: HomeIcon,
            label: "Gia đình tương lai",
        },
        {
            icon: HeartIcon,
            label: "Kiểu Tính Cách",
        },
        {
            icon: WineIcon,
            label: "Về việc uống bia rượu",
        },
        {
            icon: BoxIcon,
            label: "Bạn có hay hút thuốc không?",
        },
        {
            icon: DumbbellIcon,
            label: "Tập luyện",
        },
        {
            icon: UtensilsIcon,
            label: "Chế độ ăn uống",
        },
        {
            icon: GlobeIcon,
            label: "Truyền thông xã hội",
        },
        {
            icon: BedIcon,
            label: "Thói quen ngủ",
        },
        {
            icon: PawPrintIcon,
            label: "Thú cưng",
        },
    ];
    return (
        <div className="space-y-4">
            <p className="mb-4 text-sm text-gray-500">
                Thêm chi tiết để tìm kiếm người phù hợp hơn
            </p>
            {preferences.map((pref) => (
                <PreferenceItem
                    key={pref.label}
                    icon={pref.icon}
                    label={pref.label}
                    selected={formData.preferences?.[pref.label]}
                    expanded={expandedItem === pref.label}
                    selectedOption={formData.preferences?.[pref.label]}
                    onToggleExpand={() =>
                        setExpandedItem(
                            expandedItem === pref.label ? null : pref.label
                        )
                    }
                    onClick={(option) => handleOptionSelect(pref.label, option)}
                />
            ))}
        </div>
    );
};
export default Preferences;

import React, { useState, useEffect } from "react";
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
    "Cung hoàng đạo": [],
    "Giáo dục": [],
    "Gia đình tương lai": [],
    "Kiểu tính cách": [],
    "Về việc uống bia rượu": [
        {
            value: 1,
            name: "Có",
        },
        {
            value: 2,
            name: "Không",
        },
    ],
    "Bạn có hay hút thuốc không?": [
        {
            value: 1,
            name: "Có",
        },
        {
            value: 2,
            name: "Không",
        },
    ],
    "Tập luyện": [
        {
            value: 1,
            name: "Có",
        },
        {
            value: 2,
            name: "Không",
        },
    ],
    "Chế độ ăn uống": [],
    "Truyền thông xã hội": [],
    "Thói quen ngủ": [],
    "Thú cưng": [],
};
const PreferenceItem = ({
    icon: Icon,
    label,
    onClick,
    selected,
    expanded,
    selectedOption,
    onToggleExpand,
}) => {
    const currentSelectedOptionName = preferenceOptions[label].find(
        ({ value }) => value === selectedOption
    );
    return (
        <div className="space-y-2">
            <button
                onClick={onToggleExpand}
                className={`flex items-center justify-between w-full p-4 rounded-xl border 
            ${selected ? "border-[#FF5864] bg-[#FF5864]/5" : "border-gray-300"} 
            hover:border-gray-400 transition-colors`}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                        <span className="text-gray-900">{label}</span>
                        {selectedOption && (
                            <p className="text-sm text-gray-500">
                                {currentSelectedOptionName?.name}
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
                <div className="p-3 ml-1 space-y-2 bg-gray-50 rounded-xl animate-scale-up">
                    {preferenceOptions[label].map(({ value, name }) => (
                        <button
                            key={value}
                            onClick={() => onClick(value)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg
                 ${
                     selectedOption === value
                         ? "bg-[#FF5864] text-white"
                         : "hover:bg-gray-100"
                 }
                 transition-colors duration-200`}
                        >
                            <span>{name}</span>
                            {selectedOption === value && (
                                <CheckIcon className="w-4 h-4 text-white" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
const Preferences = ({ metadata, formData, setFormData }) => {
    useEffect(() => {
        const mappping = [
            { label: "Cung hoàng đạo", key: "zodiacs" },
            { label: "Giáo dục", key: "educations" },
            { label: "Gia đình tương lai", key: "futureFamilies" },
            {
                label: "Kiểu tính cách",
                key: "characters",
            },
            { label: "Chế độ ăn uống", key: "diets" },
            { label: "Truyền thông xã hội", key: "snus" },
            { label: "Thói quen ngủ", key: "sleeps" },
            { label: "Thú cưng", key: "pets" },
        ];
        mappping.forEach((item) => {
            preferenceOptions[item?.label] = metadata[item?.key].map(
                (item) => ({ value: item.id, name: item.value })
            );
        });
    }, [metadata]);
    const [expandedItem, setExpandedItem] = useState(null);
    const handleOptionSelect = (preference, value) => {
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [preference]: value,
            },
        }));
    };
    const preferences = [
        {
            icon: MoonIcon,
            label: "Cung hoàng đạo",
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
            label: "Kiểu tính cách",
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
            {preferences.map((pref) => {
                return (
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
                        onClick={(value) =>
                            handleOptionSelect(pref.label, value)
                        }
                    />
                );
            })}
        </div>
    );
};
export default Preferences;

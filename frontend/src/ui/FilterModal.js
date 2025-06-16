import React, { useState } from "react";
import { XIcon, SlidersIcon, CheckIcon } from "lucide-react";

const FilterModal = ({
    metadata,
    filtersData,
    isOpen,
    onHandleFilter,
    onClose,
}) => {
    const [filters, setFilters] = useState(filtersData || {});

    console.log(filters);

    const singleSelectSections = [
        {
            id: "searchingfor",
            label: "Đang tìm kiếm",
            options: metadata?.searchingFor?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "zodiac",
            label: "Cung hoàng đạo",
            options: metadata?.zodiacs?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "education",
            label: "Trình độ học vấn",
            options: metadata?.educations?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "diet",
            label: "Chế độ ăn",
            options: metadata?.diets?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "sleep",
            label: "Thói quen ngủ",
            options: metadata?.sleeps?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "sns",
            label: "Thói quen MXH",
            options: metadata?.snus?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "futurefamily",
            label: "Gia đình tương lai",
            options: metadata?.futureFamilies?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "sexOrientation",
            label: "Xu hướng tính dục",
            options: metadata?.sexualOrientations?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
    ];
    const multiSelectSections = [
        {
            id: "favorite",
            label: "Sở thích",
            multiSelect: true,
            options: metadata?.favorites?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "character",
            label: "Tính cách",
            multiSelect: true,
            options: metadata?.characters?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "communicate",
            label: "Phong cách giao tiếp",
            multiSelect: true,
            options: metadata?.communicateStyles?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "lovelanguage",
            label: "Ngôn ngữ tình yêu",
            multiSelect: true,
            options: metadata?.loveLanguages?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "pet",
            label: "Thú cưng",
            multiSelect: true,
            options: metadata?.pets?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
        {
            id: "language",
            label: "Ngôn ngữ",
            multiSelect: true,
            options: metadata?.languages?.map((item) => ({
                value: item.id,
                label: item.value,
            })),
        },
    ];
    if (!isOpen) return null;
    const handleFilterChange = (filterId, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterId]: value,
        }));
    };
    const handleOptionClick = (sectionId, value, multiSelect) => {
        if (multiSelect) {
            const currentValues = filters[sectionId] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            handleFilterChange(sectionId, newValues);
        } else {
            handleFilterChange(sectionId, value);
        }
    };
    const isSelected = (sectionId, value) => {
        const filterValue = filters[sectionId];
        if (Array.isArray(filterValue)) {
            return filterValue.includes(value);
        }
        return filterValue === value;
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-auto animate-scale-up">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SlidersIcon className="h-5 w-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Bộ lọc
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XIcon className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
                <div className="overflow-y-auto px-6 py-4">
                    <div className="space-y-6">
                        <div className="pb-4 border-b border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">
                                Chọn một tùy chọn
                            </h3>
                            {singleSelectSections.map((section) => (
                                <div key={section.id} className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        {section.label}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {section.options?.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    handleOptionClick(
                                                        section.id,
                                                        option.value,
                                                        false
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                                ${
                                    isSelected(section.id, option.value)
                                        ? "bg-[#FF5864] text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {option.label}
                                                    {/* {isSelected(
                                                        section.id,
                                                        option.value
                                                    ) && (
                                                        <CheckIcon className="h-4 w-4" />
                                                    )} */}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">
                                Chọn nhiều tùy chọn
                            </h3>
                            {multiSelectSections.map((section) => (
                                <div key={section.id}>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        {section.label}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {section.options.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    handleOptionClick(
                                                        section.id,
                                                        option.value,
                                                        true
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                                ${
                                    isSelected(section.id, option.value)
                                        ? "bg-[#FF5864] text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {option.label}
                                                    {/* {isSelected(
                                                        section.id,
                                                        option.value
                                                    ) && (
                                                        <CheckIcon className="h-4 w-4" />
                                                    )} */}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={() => onHandleFilter(filters)}
                        className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-3 px-6 rounded-xl
                     font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Áp dụng ({Object.keys(filters).length})
                    </button>
                </div>
            </div>
        </div>
    );
};
export default FilterModal;

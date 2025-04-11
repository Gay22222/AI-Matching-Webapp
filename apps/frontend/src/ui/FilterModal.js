import React from "react";
import { XIcon, SlidersIcon, CheckIcon } from "lucide-react";

const FilterModal = ({ isOpen, onClose, filters, onFilterChange }) => {
    const singleSelectSections = [
        {
            id: "searchingfor",
            label: "Đang tìm kiếm",
            options: [
                {
                    label: "Người yêu",
                    value: "relationship",
                },
                {
                    label: "Bạn bè",
                    value: "friendship",
                },
                {
                    label: "Networking",
                    value: "networking",
                },
            ],
        },
        {
            id: "zodiac",
            label: "Cung hoàng đạo",
            options: [
                {
                    label: "Bạch Dương",
                    value: "aries",
                },
                {
                    label: "Kim Ngưu",
                    value: "taurus",
                },
                {
                    label: "Song Tử",
                    value: "gemini",
                },
                {
                    label: "Cự Giải",
                    value: "cancer",
                },
                {
                    label: "Sư Tử",
                    value: "leo",
                },
                {
                    label: "Xử Nữ",
                    value: "virgo",
                },
                {
                    label: "Thiên Bình",
                    value: "libra",
                },
                {
                    label: "Bọ Cạp",
                    value: "scorpio",
                },
                {
                    label: "Nhân Mã",
                    value: "sagittarius",
                },
                {
                    label: "Ma Kết",
                    value: "capricorn",
                },
                {
                    label: "Bảo Bình",
                    value: "aquarius",
                },
                {
                    label: "Song Ngư",
                    value: "pisces",
                },
            ],
        },
        {
            id: "education",
            label: "Trình độ học vấn",
            options: [
                {
                    label: "Trung học",
                    value: "highschool",
                },
                {
                    label: "Cao đẳng",
                    value: "college",
                },
                {
                    label: "Đại học",
                    value: "university",
                },
                {
                    label: "Sau đại học",
                    value: "postgraduate",
                },
            ],
        },
        {
            id: "diet",
            label: "Chế độ ăn",
            options: [
                {
                    label: "Ăn tất cả",
                    value: "all",
                },
                {
                    label: "Ăn chay",
                    value: "vegetarian",
                },
                {
                    label: "Ăn thuần chay",
                    value: "vegan",
                },
                {
                    label: "Ăn kiêng",
                    value: "diet",
                },
            ],
        },
        {
            id: "sleep",
            label: "Thói quen ngủ",
            options: [
                {
                    label: "Chim sớm",
                    value: "early_bird",
                },
                {
                    label: "Cú đêm",
                    value: "night_owl",
                },
                {
                    label: "Ngủ sớm dậy sớm",
                    value: "early_sleep_early_wake",
                },
                {
                    label: "Không có thói quen cụ thể",
                    value: "no_pattern",
                },
            ],
        },
        {
            id: "sns",
            label: "Thói quen MXH",
            options: [
                {
                    label: "Lướt dạo ẩn thầm",
                    value: "lurker",
                },
                {
                    label: "Đăng bài thường xuyên",
                    value: "active_poster",
                },
                {
                    label: "Sử dụng vừa phải",
                    value: "moderate",
                },
                {
                    label: "Ít khi dùng",
                    value: "rare",
                },
            ],
        },
        {
            id: "futurefamily",
            label: "Gia đình tương lai",
            options: [
                {
                    label: "Muốn có con",
                    value: "want_children",
                },
                {
                    label: "Không muốn có con",
                    value: "no_children",
                },
                {
                    label: "Chưa quyết định",
                    value: "undecided",
                },
                {
                    label: "Đã có con",
                    value: "have_children",
                },
            ],
        },
        {
            id: "orientation",
            label: "Xu hướng tính dục",
            options: [
                {
                    label: "Dị tính",
                    value: "straight",
                },
                {
                    label: "Đồng tính",
                    value: "gay",
                },
                {
                    label: "Song tính",
                    value: "bisexual",
                },
                {
                    label: "Vô tính",
                    value: "asexual",
                },
            ],
        },
    ];
    const multiSelectSections = [
        {
            id: "favorite",
            label: "Sở thích",
            multiSelect: true,
            options: [
                {
                    label: "Thể thao",
                    value: "sports",
                },
                {
                    label: "Du lịch",
                    value: "travel",
                },
                {
                    label: "Âm nhạc",
                    value: "music",
                },
                {
                    label: "Nấu ăn",
                    value: "cooking",
                },
                {
                    label: "Đọc sách",
                    value: "reading",
                },
                {
                    label: "Chơi game",
                    value: "gaming",
                },
                {
                    label: "Xem phim",
                    value: "movies",
                },
                {
                    label: "Nhiếp ảnh",
                    value: "photography",
                },
            ],
        },
        {
            id: "character",
            label: "Tính cách",
            multiSelect: true,
            options: [
                {
                    label: "Hướng ngoại",
                    value: "extrovert",
                },
                {
                    label: "Hướng nội",
                    value: "introvert",
                },
                {
                    label: "Năng động",
                    value: "active",
                },
                {
                    label: "Trầm tính",
                    value: "calm",
                },
                {
                    label: "Lạc quan",
                    value: "optimistic",
                },
                {
                    label: "Thực tế",
                    value: "realistic",
                },
            ],
        },
        {
            id: "communicate",
            label: "Phong cách giao tiếp",
            multiSelect: true,
            options: [
                {
                    label: "Nghiện nhắn tin",
                    value: "text_addict",
                },
                {
                    label: "Thích gặp trực tiếp",
                    value: "face_to_face",
                },
                {
                    label: "Thích gọi điện",
                    value: "phone_call",
                },
                {
                    label: "Chat video",
                    value: "video_call",
                },
            ],
        },
        {
            id: "lovelanguage",
            label: "Ngôn ngữ tình yêu",
            multiSelect: true,
            options: [
                {
                    label: "Lời khen",
                    value: "words",
                },
                {
                    label: "Chạm tay",
                    value: "touch",
                },
                {
                    label: "Thời gian bên nhau",
                    value: "time",
                },
                {
                    label: "Quà tặng",
                    value: "gifts",
                },
                {
                    label: "Hành động",
                    value: "acts",
                },
            ],
        },
        {
            id: "pet",
            label: "Thú cưng",
            multiSelect: true,
            options: [
                {
                    label: "Chó",
                    value: "dog",
                },
                {
                    label: "Mèo",
                    value: "cat",
                },
                {
                    label: "Cá",
                    value: "fish",
                },
                {
                    label: "Chim",
                    value: "bird",
                },
                {
                    label: "Bò sát",
                    value: "reptile",
                },
            ],
        },
        {
            id: "language",
            label: "Ngôn ngữ",
            multiSelect: true,
            options: [
                {
                    label: "Tiếng Việt",
                    value: "vietnamese",
                },
                {
                    label: "Tiếng Anh",
                    value: "english",
                },
                {
                    label: "Tiếng Trung",
                    value: "chinese",
                },
                {
                    label: "Tiếng Nhật",
                    value: "japanese",
                },
                {
                    label: "Tiếng Hàn",
                    value: "korean",
                },
            ],
        },
    ];
    if (!isOpen) return null;
    const handleOptionClick = (sectionId, value, multiSelect) => {
        if (multiSelect) {
            const currentValues = filters[sectionId] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            onFilterChange(sectionId, newValues);
        } else {
            onFilterChange(sectionId, value);
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
                                        {section.options.map((option) => (
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
                        onClick={onClose}
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

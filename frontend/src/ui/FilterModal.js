import React, { useState } from "react";
import { XIcon, SlidersIcon, CheckIcon, TrashIcon } from "lucide-react";

const FilterModal = ({ metadata, filtersData, isOpen, onHandleFilter, onClose }) => {
  const [filters, setFilters] = useState(filtersData || {});
  console.log("FilterModal filters:", filters);

  // Các trường chọn một giá trị, nhưng vẫn gửi dưới dạng mảng
  const singleSelectSections = [
    { id: "searchingForIds", label: "Đang tìm kiếm", options: metadata?.searchingFor },
    { id: "zodiacIds", label: "Cung hoàng đạo", options: metadata?.zodiacs },
    { id: "educationIds", label: "Trình độ học vấn", options: metadata?.educations },
    { id: "dietIds", label: "Chế độ ăn", options: metadata?.diets },
    { id: "sleepIds", label: "Thói quen ngủ", options: metadata?.sleeps },
    { id: "snuIds", label: "Thói quen MXH", options: metadata?.snus },
    { id: "futureFamilyIds", label: "Gia đình tương lai", options: metadata?.futureFamilies },
    { id: "sexualOrientationIds", label: "Xu hướng tính dục", options: metadata?.sexualOrientations },
  ];

  // Các trường chọn nhiều giá trị
  const multiSelectSections = [
    { id: "favoriteIds", label: "Sở thích", multiSelect: true, options: metadata?.favorites },
    { id: "characterIds", label: "Tính cách", multiSelect: true, options: metadata?.characters },
    { id: "communicateStyleIds", label: "Phong cách giao tiếp", multiSelect: true, options: metadata?.communicateStyles },
    { id: "loveLanguageIds", label: "Ngôn ngữ tình yêu", multiSelect: true, options: metadata?.loveLanguages },
    { id: "petIds", label: "Thú cưng", multiSelect: true, options: metadata?.pets },
    { id: "languageIds", label: "Ngôn ngữ", multiSelect: true, options: metadata?.languages },
  ];

  // Các trường khác (loại bỏ search)
  const otherSections = [
    {
      id: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { value: "male", label: "Nam" },
        { value: "female", label: "Nữ" },
        { value: "other", label: "Khác" },
      ],
    },
    { id: "ageMin", label: "Tuổi tối thiểu", type: "number", min: 18, max: 100 },
    { id: "ageMax", label: "Tuổi tối đa", type: "number", min: 18, max: 100 },
  ];

  const handleFilterChange = (filterId, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: filterId.includes("Ids") ? (Array.isArray(value) ? value : [value]) : value,
    }));
  };

  const handleOptionClick = (sectionId, value, multiSelect) => {
    if (multiSelect) {
      const currentValues = Array.isArray(filters[sectionId]) ? filters[sectionId] : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      handleFilterChange(sectionId, newValues);
    } else {
      // Luôn lưu dưới dạng mảng cho single select
      handleFilterChange(sectionId, [value]);
    }
  };

  const isSelected = (sectionId, value) => {
    const filterValue = filters[sectionId];
    return Array.isArray(filterValue) ? filterValue.includes(value) : false;
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleApply = () => {
    // Validate filters
    const validatedFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (key.includes("Ids")) {
        if (Array.isArray(value) && value.length > 0) {
          validatedFilters[key] = value.map(Number).filter((v) => !isNaN(v));
        } else if (value && value !== "") {
          validatedFilters[key] = [Number(value)].filter((v) => !isNaN(v));
        }
      } else if (value && value !== "") {
        validatedFilters[key] = value;
      }
    });
    console.log("Applying validated filters:", validatedFilters);
    onHandleFilter(validatedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersIcon className="w-5 h-5 text-[#FF5864]" />
            <h2 className="text-lg font-semibold text-gray-800">Bộ lọc</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Single Select */}
          {singleSelectSections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{section.label}</h3>
              <div className="flex flex-wrap gap-2">
                {section.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(section.id, option.id, false)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                      ${isSelected(section.id, option.id)
                        ? "bg-[#FF5864] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {option.name || option.value}
                    {isSelected(section.id, option.id) && (
                      <CheckIcon className="inline-block w-4 h-4 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Multi Select */}
          {multiSelectSections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{section.label}</h3>
              <div className="flex flex-wrap gap-2">
                {section.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(section.id, option.id, true)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                      ${isSelected(section.id, option.id)
                        ? "bg-[#FF5864] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {option.name || option.value}
                    {isSelected(section.id, option.id) && (
                      <CheckIcon className="inline-block w-4 h-4 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Other Filters */}
          {otherSections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{section.label}</h3>
              {section.type === "select" ? (
                <select
                  value={filters[section.id] || ""}
                  onChange={(e) => handleFilterChange(section.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5864]"
                >
                  <option value="">Chọn {section.label.toLowerCase()}</option>
                  {section.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={section.type}
                  value={filters[section.id] || ""}
                  onChange={(e) => handleFilterChange(section.id, e.target.value)}
                  placeholder={`Nhập ${section.label.toLowerCase()}...`}
                  min={section.min}
                  max={section.max}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5864]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={handleResetFilters}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all"
          >
            <TrashIcon className="inline-block w-4 h-4 mr-1" />
            Xóa bộ lọc
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Áp dụng ({Object.keys(filters).length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
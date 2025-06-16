import React from "react";

const Steps = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center gap-2">
            {Array.from({
                length: totalSteps,
            }).map((_, index) => (
                <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentStep
                            ? "w-6 bg-[#FF5864]"
                            : index < currentStep
                            ? "w-6 bg-[#FF5864]/60"
                            : "w-6 bg-gray-200"
                    }`}
                />
            ))}
        </div>
    );
};
export default Steps;

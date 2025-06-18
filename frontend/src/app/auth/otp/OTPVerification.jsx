"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2Icon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { setData } from "@/utils/LocalStorage";
import axios from "axios";
import { useRouter } from "next/navigation";

const OTPVerification = ({ email, onVerify, onResend, onBack }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const router = useRouter();

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(
                () => setResendTimer(resendTimer - 1),
                1000
            );
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");
        setTimeout(() => {
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }, 1);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Vui lòng nhập đủ 6 số");
            showToast.error("Vui lòng nhập đủ 6 số");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:3001/api/auth/verify-otp", {
                email,
                otp: otpString,
            });
            if (response.data.statusCode === 200 && response.data.registrationSuccess) {
                showToast.success("Xác thực email thành công!");
                setData("registrationSuccess", true); // Lưu trạng thái vào localStorage
                router.push("/auth/login");
            } else {
                throw new Error(response.data.message || "Xác thực OTP thất bại");
            }
        } catch (err) {
            const message = err.response?.data?.message || "Xác thực OTP thất bại";
            setError(message);
            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendTimer(60);
        try {
            await onResend();
            showToast.success("Đã gửi lại mã OTP!");
        } catch (err) {
            const message = err.message || "Gửi lại OTP thất bại";
            setError(message);
            showToast.error(message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-50 relative overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF5864]/30 to-[#FF655B]/30 rounded-full blur-3xl animate-float" />
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#FF5864]/30 to-[#FF655B]/30 rounded-full blur-3xl animate-float"
                    style={{
                        animationDelay: "-3s",
                    }}
                />
                <div
                    className="absolute top-1/4 left-10 w-40 h-40 bg-gradient-to-r from-pink-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
                    style={{
                        animationDelay: "-2s",
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-r from-rose-200 to-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
                    style={{
                        animationDelay: "-4s",
                    }}
                />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
            </div>

            <main className="flex-grow flex items-center justify-center p-4 relative">
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Xác thực email
                        </h2>
                        <p className="text-gray-600">
                            Chúng tôi đã gửi mã xác thực đến
                            <br />
                            <span className="font-medium text-gray-900">
                                {email}
                            </span>
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) =>
                                        el && (inputRefs.current[index] = el)
                                    }
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(index, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-12 text-center text-2xl font-bold rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-[#FF5864] focus:border-transparent
                       disabled:opacity-50"
                                    disabled={loading}
                                />
                            ))}
                        </div>
                        {error && (
                            <p className="text-center text-sm text-red-500">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading || otp.join("").length !== 6}
                            className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-3 px-6 rounded-xl
                   font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                   disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2Icon className="h-5 w-5 animate-spin" />
                            ) : (
                                "Xác thực"
                            )}
                        </button>
                    </form>
                    <div className="space-y-4">
                        <div className="text-center">
                            <button
                                onClick={handleResend}
                                disabled={resendTimer > 0 || loading}
                                className="text-[#FF5864] hover:text-[#FF655B] font-medium disabled:opacity-50"
                            >
                                {resendTimer > 0
                                    ? `Gửi lại mã sau ${resendTimer}s`
                                    : "Gửi lại mã"}
                            </button>
                        </div>
                        <button
                            onClick={onBack}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700
                   hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OTPVerification;
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    UserIcon,
    LockIcon,
    FacebookIcon,
    Loader2Icon,
    MailIcon,
    PhoneIcon,
} from "lucide-react";
import Link from "next/link";
import { FlameIcon, ArrowLeftIcon } from "lucide-react";
import OTPVerification from "../otp/OTPVerification.jsx";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [formData, setFormData] = useState({
        name: "ken",
        email: "khanhace6222@gmail.com",
        password: "123123123",
        confirmPassword: "123123123",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (data?.statusCode === 409) {
                console.log(data?.message);
                return;
            }

            setShowOTP(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (otp) => {
        console.log(otp);

        const res = await fetch("http://localhost:3001/api/auth/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email,
                otp,
            }),
        });

        const data = await res.json();
        if (data.statusCode === 400) {
            throw new Error(data.message);
        }
        router.push("/auth/login");
    };
    const handleResendOTP = async () => {
        // Simulate API call to resend OTP
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };
    if (showOTP) {
        return (
            <OTPVerification
                email={formData.email}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                onBack={() => setShowOTP(false)}
            />
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-pink-50 to-rose-50 p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF5864]/30 to-[#FF655B]/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#FF5864]/30 to-[#FF655B]/30 rounded-full blur-3xl" />
            </div>
            <div className="w-full max-w-md relative">
                <div className="mb-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <FlameIcon className="h-16 w-16 text-transparent bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text animate-pulse" />
                            <div className="absolute inset-0 h-16 w-16 bg-[#FF5864]/20 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#FF5864] to-[#FF655B] bg-clip-text">
                        DateViet
                    </h1>
                    <p className="mt-3 text-gray-600 text-lg">
                        Tạo tài khoản mới
                    </p>
                </div>
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Nhập email của bạn"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Tạo mật khẩu"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-3 px-6 rounded-xl
                   font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2Icon className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                                "Đăng ký"
                            )}
                        </button>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gradient-to-br from-white via-pink-50 to-rose-50 text-gray-500">
                                Hoặc đăng ký với
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => {}}
                            className="w-full flex items-center justify-center gap-3 bg-white py-3 px-6 rounded-xl 
                   border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300
                   hover:border-gray-300 hover:-translate-y-0.5"
                        >
                            <img
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700 font-medium">
                                Đăng ký với Google
                            </span>
                        </button>
                        <button
                            onClick={() => {}}
                            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] py-3 px-6 rounded-xl 
                   shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <FacebookIcon className="h-5 w-5 text-white" />
                            <span className="text-white font-medium">
                                Đăng ký với Facebook
                            </span>
                        </button>
                        <button
                            onClick={() => {}}
                            className="w-full flex items-center justify-center gap-3 bg-white py-3 px-6 rounded-xl 
                   border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300
                   hover:border-gray-300 hover:-translate-y-0.5"
                        >
                            <PhoneIcon className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">
                                Đăng ký với số điện thoại
                            </span>
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Đã có tài khoản?
                        <button className="ml-2 text-[#FF5864] font-medium hover:text-[#FF655B] transition-colors duration-300">
                            Đăng nhập
                        </button>
                    </p>
                </div>
                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-300"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        <span>Quay lại ứng dụng</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

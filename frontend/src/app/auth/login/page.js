"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";
import { FacebookIcon, PhoneIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { FlameIcon, ArrowLeftIcon } from "lucide-react";
import { getData, setData } from "@/utils/LocalStorage";

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Kiểm tra trạng thái đăng ký thành công từ localStorage
    useEffect(() => {
        const registrationSuccess = getData("registrationSuccess");
        console.log("Registration success:", registrationSuccess); // Debug
        if (registrationSuccess === true) {
            showToast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            setData("registrationSuccess", null); // Xóa trạng thái sau khi hiển thị
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(formData.email, formData.password);
            showToast.success("Đăng nhập thành công!");
        } catch (error) {
            console.error("Login error:", {
                message: error.message,
                response: error.response?.data,
            }); // Debug
            let message;
            if (error.message.includes("Password is not correct")) {
                message = "Mật khẩu không đúng";
            } else if (error.message.includes("User not found")) {
                message = "Email không tồn tại";
            } else if (error.response?.status === 401) {
                message = "Thông tin đăng nhập không hợp lệ";
            } else {
                message = error.message || "Đăng nhập thất bại";
            }
            setError(message);
            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-white via-pink-50 to-rose-50">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF5864]/30 to-[#FF655B]/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#FF5864]/30 to-[#FF655B]/30 rounded-full blur-3xl" />
            </div>
            <div className="relative w-full max-w-md">
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
                    <p className="mt-3 text-lg text-gray-600">
                        Đăng nhập để tiếp tục
                    </p>
                </div>
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
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
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white py-3 px-6 rounded-xl
                   font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2Icon className="w-5 h-5 mx-auto animate-spin" />
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-gray-500 bg-gradient-to-br from-white via-pink-50 to-rose-50">
                                Hoặc đăng nhập với
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
                            <span className="font-medium text-gray-700">
                                Tiếp tục với Google
                            </span>
                        </button>
                        <button
                            onClick={() => {}}
                            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] py-3 px-6 rounded-xl 
                   shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <FacebookIcon className="w-5 h-5 text-white" />
                            <span className="font-medium text-white">
                                Tiếp tục với Facebook
                            </span>
                        </button>
                        <button
                            onClick={() => {}}
                            className="w-full flex items-center justify-center gap-3 bg-white py-3 px-6 rounded-xl 
                   border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300
                   hover:border-gray-300 hover:-translate-y-0.5"
                        >
                            <PhoneIcon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">
                                Tiếp tục với số điện thoại
                            </span>
                        </button>
                    </div>
                    <div className="text-center">
                        <button
                            onClick={() => {}}
                            className="text-sm text-[#FF5864] hover:text-[#FF655B] font-medium"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Chưa có tài khoản?
                        <button
                            className="ml-2 text-[#FF5864] font-medium hover:text-[#FF655B] transition-colors duration-300"
                            onClick={() => router.push("/auth/register")}
                        >
                            Đăng ký
                        </button>
                    </p>
                </div>
                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 transition-colors duration-300 hover:text-gray-800"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        <span>Quay lại ứng dụng</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
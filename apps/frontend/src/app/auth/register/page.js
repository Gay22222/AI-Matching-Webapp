"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserIcon,
    LockIcon,
    FacebookIcon,
    MailIcon,
    PhoneIcon,
} from "lucide-react";
export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "ken",
        email: "ken@gmail.com",
        password: "123",
        confirmPassword: "123",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

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

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Store token
            localStorage.setItem("token", data.token);

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[#FF5864] to-[#FF655B]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Create Account
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Sign up and start meeting new people
                    </p>
                </div>
                <div className="flex flex-col space-y-4">
                    <button className="flex items-center justify-center w-full p-3 space-x-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FacebookIcon size={20} className="text-blue-600" />
                        <span>Continue with Facebook</span>
                    </button>
                    <button className="flex items-center justify-center w-full p-3 space-x-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <MailIcon size={20} className="text-red-500" />
                        <span>Continue with Google</span>
                    </button>
                    <div className="flex items-center">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <p className="px-3 text-sm text-gray-500">OR</p>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                </div>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md">
                        <label htmlFor="phone" className="sr-only">
                            Phone Number
                        </label>
                        <div className="flex items-center">
                            <PhoneIcon className="w-5 h-5 text-gray-400 absolute ml-3" />
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>
                    <div className="rounded-md">
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <div className="flex items-center">
                            <UserIcon className="w-5 h-5 text-gray-400 absolute ml-3" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Email address"
                            />
                        </div>
                    </div>
                    <div className="rounded-md">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="flex items-center">
                            <LockIcon className="w-5 h-5 text-gray-400 absolute ml-3" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5864] focus:border-transparent"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-[#FF5864] to-[#FF655B] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5864]"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
<<<<<<< HEAD
                <div className="text-center">
                    <button
                        className="text-[#FF5864] hover:underline"
                        onClick={() => router.push("/auth/login")}
                    >
                        Already have an account? Sign in
                    </button>
                </div>
=======
>>>>>>> chat-temp
            </div>
        </div>
    );
}

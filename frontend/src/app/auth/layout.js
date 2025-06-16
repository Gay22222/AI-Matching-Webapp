"use client";
import { AuthProvider } from "@/hooks/useAuth";

export default function AuthLayout({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}

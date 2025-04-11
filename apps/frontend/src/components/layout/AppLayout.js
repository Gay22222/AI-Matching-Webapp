import Footer from "@/ui/Footer";
import Header from "@/ui/Header";
import React from "react";

const AppLayout = ({ children }) => {
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
            <Header />
            <main className="flex-grow flex items-center justify-center p-4 relative">
                {children}
            </main>
            <Footer />
        </div>
    );
};
export default AppLayout;

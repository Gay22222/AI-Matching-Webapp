"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { setupAxios } from "@/app/auth/_helpers";
export default function Home() {
    setupAxios(axios);

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/hello")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error("API Error:", err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold"> AI Matching WebApp</h1>
            <p className="text-lg mt-4">{message || "Loading..."}</p>
        </div>
    );
}

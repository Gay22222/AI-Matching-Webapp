"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [profileSetupData, setProfileSetupData] = useState();
    console.log(profileSetupData);
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/me", {
                    withCredentials: true,
                });
                setProfileSetupData(res.data.userWithoutPassword);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setProfileSetupData(null);
            }

            try {
                // Optional: nếu endpoint này có sử dụng nội bộ
                await axios.get("/api/some-protected-route");
            } catch (err) {
                console.warn("some-protected-route failed (optional):", err.message);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <ProfileContext.Provider
            value={{ profileSetupData, setProfileSetupData }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}

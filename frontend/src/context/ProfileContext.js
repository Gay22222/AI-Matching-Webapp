"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [profileSetupData, setProfileSetupData] = useState();
    console.log("Profile setup data:", profileSetupData);

    useEffect(() => {
        console.warn("Skipping /api/profile-setup call as it does not exist");
        // const fetchProfileSetupData = async () => {
        //     try {
        //         console.log("Calling /api/profile-setup...");
        //         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile-setup`);
        //         console.log("Profile setup response:", JSON.stringify(response.data, null, 2));
        //         setProfileSetupData(response.data.data);
        //     } catch (error) {
        //         console.error("Error fetching profile data:", {
        //             message: error.message,
        //             status: error.response?.status,
        //             data: error.response?.data ? JSON.stringify(error.response.data) : null,
        //             headers: error.response?.headers,
        //         });
        //     }
        // };
        // fetchProfileSetupData();
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

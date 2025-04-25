"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [profileSetupData, setProfileSetupData] = useState();
    console.log(profileSetupData);
    useEffect(() => {
        const fetchProfileSetupData = async () => {
            axios
                .get("http://localhost:3001/api/profile-setup")
                .then((response) => {
                    console.log(response);

                    setProfileSetupData(response.data.data);
                })
                .catch((error) => {
                    console.error("Error fetching profile setup data:", error);
                });
        };
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

"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { setupAxios } from "@/app/auth/_helpers";
import { useAuth } from "@/hooks/useAuth";

setupAxios(axios);
const MetadataContext = createContext(null);

export function MetadataProvider({ children }) {
    const { auth } = useAuth();
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetadata = async (retries = 2, delay = 1000) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = auth?.access_token;
            console.log("Fetching metadata with token:", token ? token.slice(0, 20) + "..." : "No token");
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/metadata`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            console.log("Metadata response:", JSON.stringify(res.data, null, 2));
            setMetadata(res.data.metadata);
        } catch (err) {
            console.error("Failed to fetch metadata:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            setError(err.message || "Failed to load metadata");
        } finally {
            setIsLoading(false); // Đảm bảo isLoading là false
        }
    };

    useEffect(() => {
        let isMounted = true;
        const loadMetadata = async () => {
            if (isMounted && auth?.access_token) {
                await fetchMetadata();
            } else if (isMounted) {
                setIsLoading(false);
            }
        };
        loadMetadata();
        return () => { isMounted = false; }; // Cleanup
    }, [auth?.access_token]);

    const value = useMemo(
        () => ({
            metadata,
            isLoading,
            error,
        }),
        [metadata, isLoading, error]
    );

    return (
        <MetadataContext.Provider value={value}>
            {children}
        </MetadataContext.Provider>
    );
}

export function useMetadata() {
    const context = useContext(MetadataContext);
    if (!context) {
        throw new Error("useMetadata must be used within a MetadataProvider");
    }
    return context;
}

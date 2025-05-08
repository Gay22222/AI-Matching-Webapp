"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { setupAxios } from "@/app/auth/_helpers";
import { getData } from "@/utils/LocalStorage";

setupAxios(axios);
const MetadataContext = createContext(null);

export function MetadataProvider({ children }) {
    const [metadata, setMetadata] = useState(null);
    console.log(metadata);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchData = async () => {
                    const token = getData("token");

                    const res = await axios.get(
                        "http://localhost:3001/api/metadata"
                    );
                    setMetadata(res.data.metadata);
                };
                fetchData();
            } catch (err) {
                console.error("Failed to fetch metadata in Provider:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetadata();
    }, []);

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

import { getData, setData } from "@/utils/LocalStorage";

export const getAuth = () => {
    try {
        const auth = getData("AUTH_LOCAL_STORAGE_KEY");
        return auth || undefined; // Trả về undefined nếu auth là null
    } catch (error) {
        console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
        return undefined;
    }
};

export const setAuth = (auth) => {
    setData("AUTH_LOCAL_STORAGE_KEY", auth);
};

export const removeAuth = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            localStorage.removeItem("AUTH_LOCAL_STORAGE_KEY");
        } catch (error) {
            console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
        }
    }
};
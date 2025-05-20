import { getData, setData } from "@/utils/LocalStorage";

export const getAuth = () => {
    try {
        const auth = getData("AUTH_LOCAL_STORAGE_KEY");
        if (auth) {
            return auth;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
    }
};
export const setAuth = (auth) => {
    setData("AUTH_LOCAL_STORAGE_KEY", auth);
};
export const removeAuth = () => {
    if (!localStorage) {
        return;
    }
    try {
        localStorage.removeItem("AUTH_LOCAL_STORAGE_KEY");
    } catch (error) {
        console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
    }
};

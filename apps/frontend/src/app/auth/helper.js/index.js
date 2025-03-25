export const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
};

import { getData, setData } from "@/utils/LocalStorage";
const AUTH_LOCAL_STORAGE_KEY = "token";
const getAuth = () => {
    try {
        const auth = getData(AUTH_LOCAL_STORAGE_KEY);
        if (auth) {
            return auth;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
    }
};

const setAuth = (auth) => {
    setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const removeAuth = () => {
    if (!localStorage) return;
    try {
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
    }
};

const setupAxios = (axios) => {
    axios.defaults.headers.Accept = "application/json";
    axios.interceptors.request.use(
        (config) => {
            const auth = getAuth();
            console.log(auth, "request");

            if (auth?.access_token) {
                config.headers.Authorization = `Bearer ${auth.access_token}`;
            }
            return config;
        },
        async (err) => await Promise.reject(err)
    );
};

export { getAuth, setAuth, removeAuth, setupAxios };

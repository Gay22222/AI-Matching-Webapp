import { getData, setData } from "@/utils/LocalStorage";
const AUTH_LOCAL_STORAGE_KEY = "token";
export const getAuth = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  } catch (e) {
    console.error("Invalid token format in localStorage");
    return null;
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
    axios.defaults.withCredentials = true; // Bật gửi cookie tự động
};

export { setupAxios };

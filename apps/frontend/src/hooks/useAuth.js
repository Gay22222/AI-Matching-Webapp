"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { setupAxios } from "@/app/auth/_helpers";
import { getData } from "@/utils/LocalStorage";
import * as authHelper from "./_helper";
import { useRouter } from "next/navigation";

setupAxios(axios);
const AuthContext = createContext(null);

const LOGIN_URL = "http://localhost:3001/api/auth/login";
const REGISTER_URL = "/auth/register";
const GET_USER_URL = "http://localhost:3001/api/me";

export function AuthProvider({ children }) {
    const router = useRouter();
    const [auth, setAuth] = useState(authHelper?.getAuth());
    const [currentUser, setCurrentUser] = useState();

    const verify = async (auth, shouldRedirect = false) => {
        if (auth) {
            try {
                const { data: user } = await getUser(auth);

                setCurrentUser(user.user);
                if (!user?.user?.isFullInformation) {
                    router.push("/profile-setup");
                    return;
                }
                if (shouldRedirect) {
                    router.push("/");
                }
            } catch {
                saveAuth(undefined);
                setCurrentUser(undefined);
            }
        }
    };
    useEffect(() => {
        const auth = authHelper?.getAuth();
        if (auth) {
            console.log("auth", auth);

            verify(auth?.access_token, false);
        }
    }, [auth]);
    const saveAuth = (auth) => {
        if (auth) {
            authHelper?.setAuth(auth);
            setAuth(auth);
        } else {
            authHelper?.removeAuth();
        }
    };
    const login = async (email, password) => {
        try {
            const { data: auth } = await axios.post(LOGIN_URL, {
                email,
                password,
            });
            const authData = {
                access_token: auth.token,
                token_type: "Token",
            };
            saveAuth(authData);
            verify(auth.token, true);
            return true;
        } catch (error) {
            saveAuth(undefined);
            throw new Error(`Error ${error}`);
        }
    };
    const register = async (email, password, password_confirmation) => {
        try {
            const { data: auth } = await axios.post(REGISTER_URL, {
                email,
                password,
                password_confirmation,
            });
            saveAuth(auth);
            const { data: user } = await getUser();
            setCurrentUser(user);
        } catch (error) {
            saveAuth(undefined);
            throw new Error(`Error ${error}`);
        }
    };
    const getUser = (accessToken) => {
        console.log("GET_USER_URL", GET_USER_URL);

        return axios.get(GET_USER_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };
    const logout = () => {
        console.log("removeAuth");

        saveAuth(undefined);
        setCurrentUser(undefined);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                currentUser,
                setCurrentUser,
                verify,
                saveAuth,
                login,
                register,
                getUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}

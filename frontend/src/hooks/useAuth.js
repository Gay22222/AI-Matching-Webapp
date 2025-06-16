"use client";

import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { setupAxios } from "@/app/auth/_helpers";
import { useRouter } from "next/navigation";
import * as authHelper from "./_helper";

setupAxios(axios);
const AuthContext = createContext(null);

const LOGIN_URL = "http://localhost:3001/api/auth/login";
const REGISTER_URL = "/auth/register";
const GET_USER_URL = "http://localhost:3001/api/user/me";

export function AuthProvider({ children }) {
  const router = useRouter();
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verify = async (accessToken, shouldRedirect = false) => {
    console.log("Verifying token:", accessToken ? accessToken.slice(0, 20) + "..." : "missing");
    if (!accessToken) {
      console.warn("No access token available");
      saveAuth(undefined);
      setCurrentUser(null);
      setLoading(false);
      if (shouldRedirect) {
        router.push("/auth/login");
      }
      return;
    }
    try {
      setLoading(true);
      const { data: user } = await getUser(accessToken);
      console.log("User data:", JSON.stringify(user, null, 2));
      setCurrentUser(user.user);
      if (!user?.user) {
        console.error("User not found");
        saveAuth(undefined);
        setCurrentUser(null);
        router.push("/auth/login");
        return;
      }
      if (!user?.user?.isFullInformation) {
        console.log("User has incomplete profile, redirecting to profile-setup");
        router.push("/profile-setup");
        return;
      }
      if (shouldRedirect) {
        console.log("Redirecting to home");
        router.push("/");
      }
    } catch (error) {
      console.error("Error verifying user:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      saveAuth(undefined);
      setCurrentUser(null);
      if (error.response?.status === 404) {
        console.error("Endpoint /api/user/me not found. Check backend configuration.");
      }
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authData = authHelper.getAuth();
    console.log("Initial auth data:", authData);
    if (authData?.access_token) {
      verify(authData.access_token, false);
    } else {
      console.warn("No auth data found in localStorage");
      setLoading(false);
      router.push("/auth/login");
    }
  }, [router]);

  const saveAuth = (auth) => {
    console.log("Saving auth:", auth);
    if (auth) {
      authHelper.setAuth(auth);
      setAuth(auth);
    } else {
      authHelper.removeAuth();
      setAuth(null);
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
      await verify(auth.token, true);
      return true;
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        response: error.response?.data,
      });
      saveAuth(undefined);
      throw new Error(`Login error: ${error.response?.data?.message || error.message}`);
    }
  };

  const register = async (email, password, password_confirmation) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        email,
        password,
        password_confirmation,
      });
      const authData = {
        access_token: auth.token,
        token_type: "Token",
      };
      saveAuth(authData);
      const { data: user } = await getUser(auth.token);
      setCurrentUser(user.user);
    } catch (error) {
      console.error("Registration error:", {
        message: error.message,
        response: error.response?.data,
      });
      saveAuth(undefined);
      throw new Error(`Registration error: ${error.response?.data?.message || error.message}`);
    }
  };

  const getUser = async (accessToken) => {
    try {
      return await axios.get(GET_USER_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Get user error:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      if (!auth?.access_token) {
        throw new Error("No access token available");
      }
      const { data: user } = await getUser(auth.access_token);
      setCurrentUser(user.user);
      console.log("User refreshed:", JSON.stringify(user.user, null, 2));
    } catch (error) {
      console.error("Error refreshing user:", {
        message: error.message,
        response: error.response?.data,
      });
      saveAuth(undefined);
      setCurrentUser(null);
      router.push("/auth/login");
    }
  };

  const logout = () => {
    console.log("Logging out");
    saveAuth(undefined);
    setCurrentUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ auth, currentUser, loading, login, register, refreshUser, logout }}>
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
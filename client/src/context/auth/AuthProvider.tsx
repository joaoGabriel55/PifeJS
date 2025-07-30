import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { useMutation } from "@tanstack/react-query";

type AuthProviderProps = {
  children: React.ReactNode;
};

const login = async (email: string, password: string) => {
  const response = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  return {
    token: data.token,
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const { mutateAsync } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      const origin = location.state?.from?.pathname || "/rooms";
      navigate(origin);
    },
    onError: (error) => {
      console.error("Login error:", error);
    }
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    console.log("Stored token:", storedToken);

    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken("");
    }
  }, []);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    await mutateAsync({
      email,
      password
    });
  };

  const handleLogout = () => {
    setToken("");
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

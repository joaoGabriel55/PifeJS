import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
  children: React.ReactNode;
};

const fakeAuth = (): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    console.log("Stored token:", storedToken);

    if (storedToken) {
      setToken(storedToken);

      const origin = location.state?.from?.pathname || "/rooms";

      navigate(origin);
    } else {
      setToken("");
    }
  }, [location.state?.from?.pathname, navigate]);

  const handleLogin = async () => {
    const token = await fakeAuth();

    localStorage.setItem("token", token);

    setToken(token);

    const origin = location.state?.from?.pathname || "/rooms";

    navigate(origin);
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

import { createContext } from "react";

export const AuthContext = createContext<{
  token: string;
  onLogin: ({ email, password }: { email: string; password: string }) => void;
  onLogout: () => void;
}>({
  token: "",
  onLogin: () => {},
  onLogout: () => {},
});

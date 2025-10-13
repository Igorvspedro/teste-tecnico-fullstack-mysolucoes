import { createContext } from "react";
import type { User } from "../entities/User";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading?: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: { id: 0, email: "", password: "" },
  login: async () => {},
  logout: () => {},
});

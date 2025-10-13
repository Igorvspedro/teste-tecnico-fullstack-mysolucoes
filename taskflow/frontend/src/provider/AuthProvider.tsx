import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../entities/User";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("taskflow-user");

      if (savedUser && savedUser !== "undefined") {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        localStorage.removeItem("taskflow-user");
      }
    } catch (error) {
      console.error("Erro ao ler o usuário do localStorage:", error);
      localStorage.removeItem("taskflow-user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("taskflow-user", JSON.stringify(data.user));
      localStorage.setItem("taskflow-token", data.token);

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

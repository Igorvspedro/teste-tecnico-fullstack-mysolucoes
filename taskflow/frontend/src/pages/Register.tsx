import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || "Erro ao registrar usuário."
      );
    }
  };

  return (
    <div className="">
      <header>
        <h1>TaskFlow</h1>
      </header>

      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <form onSubmit={handleRegister} className="">
          <h1 className="">Criar conta</h1>

          {error && <p className="">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-full">Registrar</button>

          <button className="btn btn-outline w-full" onClick={() => navigate("/")}>
            Já tem uma conta?
          </button>
        </form>
      </div>
    </div>
  );
}

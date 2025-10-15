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
    <div className="content flex flex-col items-center justify-center min-h-screen fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
      </header>

      <form
        onSubmit={handleRegister}
        className="form w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          Criar Conta
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
        )}

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button type="submit" className="btn btn-primary w-full">
            Registrar
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-outline w-full"
          >
            Já tem uma conta?
          </button>
        </div>
      </form>
    </div>
  );
}

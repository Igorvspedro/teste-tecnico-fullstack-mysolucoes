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
      setError(axiosError.response?.data?.message || "Erro ao registrar usuário.");
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleRegister}
        className=""
      >
        <h1 className="">
          Criar conta
        </h1>

        {error && <p className="">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="">
          Registrar
        </button>

        <p className="">
          Já tem uma conta?{" "}
          <span
            className=""
            onClick={() => navigate("/")}
          >
            Entrar
          </span>
        </p>
      </form>
    </div>
  );
}

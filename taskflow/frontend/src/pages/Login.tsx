import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      <p>Email ou senha incorretos</p>;
    }
  };

  return (
    <div className="content flex flex-col items-center justify-center min-h-screen fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="form w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          Login
        </h2>

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
            Entrar
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn btn-outline w-full"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}

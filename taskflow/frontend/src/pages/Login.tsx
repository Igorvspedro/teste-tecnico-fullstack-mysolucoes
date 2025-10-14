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
      alert("Email ou senha incorretos");
    }
  };

  return (
    <div>
      <header>
        <h1>TaskFlow</h1>
      </header>

      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl shadow-md w-full max-w-md"
        >
          <h1>Login</h1>

          <label>E-mail:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-full">
            Entrar
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn btn-success w-full"
          >
            Criar conta
          </button>
        </form>
      </div>
    </div>
  );
}

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
    <div className="">
      <form
        onSubmit={handleSubmit}
        className=""
      >
        <h1 className="">
          TaskFlow
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=""
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
          required
        />

        <button
          type="submit"
          className=""
        >
          Entrar
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className=""
        >
          Criar conta
        </button>
      </form>
    </div>
  );
}

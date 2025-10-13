import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="">
        <h1 className="">TaskFlow</h1>
        <input
          type="email"
          placeholder="Email"
          className=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="">
          Entrar
        </button>
      </form>
    </div>
  );
}

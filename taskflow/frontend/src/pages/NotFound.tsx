import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="">
      <h1 className="">404</h1>
      <p className="">Página não encontrada.</p>
      <button
        onClick={() => navigate("/")}
        className=""
      >
        Voltar para o início
      </button>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="content flex flex-col items-center justify-center min-h-screen text-center fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
      </header>

      <h2 className="text-6xl font-extrabold text-gray-800 mb-2">404</h2>
      <p className="text-lg text-gray-600 mb-6">
        Página não encontrada.
      </p>

      <button
        onClick={() => navigate("/")}
        className="btn btn-outline w-48"
      >
        Voltar para o início
      </button>
    </div>
  );
}

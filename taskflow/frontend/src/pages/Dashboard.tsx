import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Task } from "../entities/Task";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("taskflow-token");
      const { data } = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar tarefas.");
    }
  };

  useEffect(() => {
    if (!user) navigate("/");
    else loadTasks();
  }, [user, navigate]);

  return (
    <div className="">
      <header className="">
        <h1 className="">TaskFlow</h1>
        <div className="">
          <span className="text-gray-700">Olá, {user?.email}</span>
          <button onClick={logout} className="">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Minhas Tarefas
          </h2>
          <button
            onClick={() => navigate("/create-task")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            + Nova Tarefa
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg text-gray-800">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{task.description}</p>
                <p className="text-sm mt-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      task.status === "pendente"
                        ? "bg-yellow-500"
                        : task.status === "em_andamento"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.status === "pendente"
                      ? "Pendente"
                      : task.status === "em_andamento"
                      ? "Em andamento"
                      : "Concluída"}
                  </span>
                </p>
                {task.deadline && (
                  <p className="text-xs text-gray-500 mt-2">
                    Prazo: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-task/${task.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

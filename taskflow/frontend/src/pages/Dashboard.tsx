import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Task } from "../entities/Task";
import { TaskStatusEnum } from "../enums/TaskStatusEnum";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
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
      <p>Erro ao carregar tarefas</p>;
    }
  };

  useEffect(() => {
    if (!user) navigate("/");
    else loadTasks();
  }, [user, navigate]);

  const filteredTasks =
    statusFilter === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const statusOptions = [
    { value: "ALL", label: "Todos" },
    { value: TaskStatusEnum.PENDING, label: "Pendente" },
    { value: TaskStatusEnum.IN_PROGRESS, label: "Em andamento" },
    { value: TaskStatusEnum.DONE, label: "Concluída" },
  ];

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b bg-gray-100">
        <h1 className="font-bold text-lg">TaskFlow</h1>
        <div>
          <span className="text-gray-700 px-2">Olá, {user?.email}</span>
          <button onClick={logout} className="btn btn-danger">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-semibold text-xl">Minhas Tarefas</h1>
          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`
                    px-3 py-1 rounded-full text-sm border transition 
                    ${
                      statusFilter === opt.value
                        ? "btn btn-primary"
                        : "btn btn-outline"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate("/create-task")}
              className="btn btn-success"
            >
              + Nova Tarefa
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg text-gray-800">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{task.description}</p>
                <p className="text-sm mt-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      task.status === TaskStatusEnum.PENDING
                        ? "bg-yellow-500"
                        : task.status === TaskStatusEnum.IN_PROGRESS
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.status === TaskStatusEnum.PENDING
                      ? "Pendente"
                      : task.status === TaskStatusEnum.IN_PROGRESS
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
                    className="btn btn-outline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Deseja realmente remover esta tarefa?"
                      );
                      if (!confirmDelete) return;

                      try {
                        const token = localStorage.getItem("taskflow-token");
                        await api.delete(`/tasks/${task.id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        loadTasks();
                      } catch (error) {
                        console.error(error);
                        <p>Erro ao remover tarefa</p>;
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Remover
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

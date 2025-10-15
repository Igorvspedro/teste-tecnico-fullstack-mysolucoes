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

  const formatLocalDate = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString();
  };

  return (
    <div className="app">
      <main className="flex-1">
        <header className="topbar">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span className="logo">TF</span>
            TaskFlow
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Olá, <b>{user?.email}</b>
            </span>
            <button onClick={logout} className="btn btn-primary">
              Sair
            </button>
          </div>
        </header>

        <main className="content">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-semibold">Minhas Tarefas</h1>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    className={`btn btn-sm ${
                      statusFilter === opt.value
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
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
            <div className="empty">
              <h2 className="text-gray-600">Nenhuma tarefa encontrada.</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>

                  <p className="mt-3">
                    <span
                      className={`status ${
                        task.status === TaskStatusEnum.PENDING
                          ? "open"
                          : task.status === TaskStatusEnum.IN_PROGRESS
                          ? "warn"
                          : "done"
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
                      Prazo: {formatLocalDate(task.deadline)}
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
                      className="btn btn-danger"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </main>
    </div>
  );
}

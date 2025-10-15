import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { TaskStatusEnum } from "../../enums/TaskStatusEnum";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum([TaskStatusEnum.PENDING, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.DONE]),
  deadline: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function CreateTask() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const token = localStorage.getItem("taskflow-token");
      await api.post("/tasks", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      <p>Erro ao criar tarefa.</p>;
    }
  };

  return (
    <div className="content flex flex-col items-center justify-center min-h-screen fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Nova Tarefa</h2>

        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            placeholder="Digite o título"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Descrição (opcional)</label>
          <textarea
            id="description"
            placeholder="Adicione detalhes sobre a tarefa"
            rows={3}
            {...register("description")}
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select id="status" {...register("status")}>
            <option value={TaskStatusEnum.PENDING}>Pendente</option>
            <option value={TaskStatusEnum.IN_PROGRESS}>Em andamento</option>
            <option value={TaskStatusEnum.DONE}>Concluída</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline">Prazo</label>
          <input id="deadline" type="date" {...register("deadline")} />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button type="submit" className="btn btn-primary w-full">
            Criar
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline w-full"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

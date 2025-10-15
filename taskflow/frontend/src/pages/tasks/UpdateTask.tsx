import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { TaskStatusEnum } from "../../enums/TaskStatusEnum";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum([TaskStatusEnum.PENDING, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.DONE]),
  deadline: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function UpdateTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    const loadTask = async () => {
      try {
        const token = localStorage.getItem("taskflow-token");
        const { data } = await api.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setValue("title", data.title);
        setValue("description", data.description || "");
        setValue("status", data.status);
        setValue(
          "deadline",
          data.deadline
            ? new Date(data.deadline).toISOString().split("T")[0]
            : ""
        );
      } catch (err) {
        console.error(err);
        <p>Erro ao carregar a tarefa</p>;
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const token = localStorage.getItem("taskflow-token");
      await api.put(`/tasks/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      <p>Erro ao atualizar a tarefa</p>;
    }
  };

  if (loading) return <h2>Carregando...</h2>;

  return (
    <div>
      <header>
        <h1>TaskFlow</h1>
      </header>

      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1>Editar Tarefa</h1>

          <input
            type="text"
            placeholder="Título"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <textarea
            placeholder="Descrição (opcional)"
            {...register("description")}
          />

          <select
            {...register("status")}
          >
            <option value={TaskStatusEnum.PENDING}>Pendente</option>
            <option value={TaskStatusEnum.IN_PROGRESS}>Em andamento</option>
            <option value={TaskStatusEnum.DONE}>Concluída</option>
          </select>

          <input
            type="date"
            {...register("deadline")}
          />

          <button
            type="submit"
            className="btn btn-success w-full"
          >
            Atualizar
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline w-full"
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}

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
  status: z.enum([
    TaskStatusEnum.PENDING,
    TaskStatusEnum.IN_PROGRESS,
    TaskStatusEnum.DONE,
  ]),
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
        const { data } = await api.get(`/tasks/${id}`);

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
      await api.put(`/tasks/${id}`, data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      <p>Erro ao atualizar a tarefa</p>;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <h2>Carregando...</h2>
      </div>
    );

  return (
    <div className="content flex flex-col items-center justify-center min-h-screen fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          Editar Tarefa
        </h2>

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
            Atualizar
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["pendente", "em_andamento", "concluida"]),
  deadline: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function UpdateTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TaskFormData>({
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
        setValue("deadline", data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : "");
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar a tarefa.");
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
      alert("Tarefa atualizada com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar a tarefa.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Tarefa</h2>

        <input
          type="text"
          placeholder="Título"
          {...register("title")}
          className="border p-2 w-full rounded mb-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <textarea
          placeholder="Descrição (opcional)"
          {...register("description")}
          className="border p-2 w-full rounded mb-2"
        />

        <select {...register("status")} className="border p-2 w-full rounded mb-2">
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>

        <input
          type="date"
          {...register("deadline")}
          className="border p-2 w-full rounded mb-2"
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700"
        >
          Atualizar
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-2 text-gray-500 hover:underline w-full"
        >
          Voltar
        </button>
      </form>
    </div>
  );
}

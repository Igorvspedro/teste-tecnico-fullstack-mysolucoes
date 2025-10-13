import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["pendente", "em_andamento", "concluida"]),
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
      alert("Tarefa criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar tarefa.");
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <h2 className="">Nova Tarefa</h2>

        <input
          type="text"
          placeholder="Título"
          {...register("title")}
          className=""
        />
        {errors.title && <p className="">{errors.title.message}</p>}

        <textarea
          placeholder="Descrição (opcional)"
          {...register("description")}
          className=""
        />

        <select
          {...register("status")}
          className=""
        >
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>

        <input type="date" {...register("deadline")} className="" />

        <button type="submit" className="">
          Criar
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className=""
        >
          Voltar
        </button>
      </form>
    </div>
  );
}

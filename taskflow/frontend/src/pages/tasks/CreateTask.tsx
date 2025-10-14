import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../services/api";
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
      <header>
        <h1>TaskFlow</h1>
      </header>

      <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <h1 className="">Nova Tarefa</h1>

        <input
          type="text"
          placeholder="Título"
          {...register("title")}
        />
        {errors.title && <p className="">{errors.title.message}</p>}

        <textarea
          placeholder="Descrição (opcional)"
          {...register("description")}
        />

        <select
          {...register("status")}
        >
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>

        <input type="date" {...register("deadline")} className="" />

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
      </form>
      </div>
    </div>
  );
}

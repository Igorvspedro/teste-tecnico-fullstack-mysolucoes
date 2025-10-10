import type { Request, Response } from "express";
import Task from "../models/Task.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status, deadline } = req.body;
  try {
    const task = await Task.create({ title, description, status, deadline, userId: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar tarefa" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.findAll({ where: { userId: req.userId } });
  res.json(tasks);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const task = await Task.findOne({ where: { id, userId: req.userId } });
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  await task.update(req.body);
  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const task = await Task.findOne({ where: { id, userId: req.userId } });
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  await task.destroy();
  res.json({ message: "Tarefa deletada" });
};

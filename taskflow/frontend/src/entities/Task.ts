import type { TaskStatusEnum } from "../enums/TaskStatusEnum";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatusEnum.PENDING | TaskStatusEnum.IN_PROGRESS | TaskStatusEnum.DONE;
  deadline?: string;
}
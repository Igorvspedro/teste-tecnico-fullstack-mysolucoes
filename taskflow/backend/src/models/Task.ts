import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./User.js";
import { TaskEnumStatus } from "../enums/TaskEnumStatus.js";

@Table({ tableName: "tasks" })
export default class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column({
    type: DataType.ENUM(TaskEnumStatus.PENDING, TaskEnumStatus.IN_PROGRESS, TaskEnumStatus.DONE),
    defaultValue: TaskEnumStatus.PENDING,
  })
  declare status: string;

  @Column(DataType.DATE)
  declare deadline: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}

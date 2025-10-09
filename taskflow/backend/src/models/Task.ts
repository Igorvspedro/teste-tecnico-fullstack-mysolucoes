import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./User";

@Table({ tableName: "tasks" })
export default class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({
    type: DataType.ENUM("pendente", "em andamento", "concluída"),
    defaultValue: "pendente",
  })
  status!: string;

  @Column(DataType.DATE)
  deadline?: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

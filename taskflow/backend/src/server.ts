import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_NAME
) {
  throw new Error(
    "As variáveis ​​de ambiente do banco de dados não estão definidas corretamente."
  );
}

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [User, Task],
});

sequelize.sync().then(() => console.log("Banco conectado"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 25060;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

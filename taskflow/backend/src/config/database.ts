import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "../models/User.js";
import Task from "../models/Task.js";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [User, Task],
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    
    await sequelize.sync();
  } catch (error) {
  }
};

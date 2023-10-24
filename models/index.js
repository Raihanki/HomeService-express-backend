import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import database from "../config/database.js";

dotenv.config();
const env = process.env.NODE_ENV || "development";
const config = database[env];

export const db = new Sequelize({
  host: config.host,
  username: config.username,
  password: config.password,
  database: config.database,
  dialect: config.dialect,
});

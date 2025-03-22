import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Load biến môi trường từ backend/src/config/.env
dotenv.config({ path: path.resolve("src/config/.env") });

const prisma = new PrismaClient();
export default prisma;

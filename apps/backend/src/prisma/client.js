import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("src/config/.env") });

const prisma = new PrismaClient();
async function listDatabases() {
    const databases = await prisma.$queryRaw`SHOW DATABASES;`;
}

listDatabases()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

async function listTables() {
    const tables = await prisma.$queryRaw`SHOW TABLES;`;
}

listTables()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

async function listUsers() {
    const users = await prisma.users.findMany();
    // console.log("Users:", users);
}

async function listMatches() {
    const matches = await prisma.matches.findMany();
    // console.log("Matches:", matches);
}

async function main() {
    await listUsers();
    await listMatches();
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
export default prisma;

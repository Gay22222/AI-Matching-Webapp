import prisma from "../prisma/client.js";

export const findUserByEmail = async (email) => {
    return await prisma.users.findUnique({ where: { email } });
};

export const createUser = async (userData) => {
    return await prisma.users.create({ data: userData });
};

export const findUsersOnline = async () => {
    const users = await prisma.users.findMany();
    return users;
};

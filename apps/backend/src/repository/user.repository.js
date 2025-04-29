import prisma from "../prisma/client.js";

export const userRepository = {
    findUserByEmail: async (email) => {
        return await prisma.users.findUnique({
            where: { email },
            include: {
                Bio: {
                    include: {
                        Base_inf: {
                            include: {
                                Zodiac: true,
                                Character: true,
                                Communicate_style: true,
                                Love_language: true,
                                FutureFamily: true,
                            },
                        },
                    },
                },
            },
        });
    },
    findUserById: async (id) => {
        return await prisma.users.findUnique({
            where: { id: parseInt(id) },
            include: {
                Bio: {
                    include: {
                        Base_inf: {
                            include: {
                                Zodiac: true,
                                Character: true,
                                Communicate_style: true,
                                Love_language: true,
                                FutureFamily: true,
                            },
                        },
                    },
                },
            },
        });
    },
    getUsers: async () => {
        const users = await prisma.users.findMany({
            include: {
                Bio: {
                    include: {
                        main_inf: {
                            include: {
                                Language: true,
                                Religion: true,
                                Career: true,
                                Education: true,
                            },
                        },
                        Base_inf: {
                            include: {
                                Zodiac: true,
                                Character: true,
                                Communicate_style: true,
                                Love_language: true,
                                FutureFamily: true,
                            },
                        },
                        Lifestyle: {
                            include: {
                                Pet: true,
                                Diet: true,
                                Sleep: true,
                                SNU: true,
                            },
                        },
                        Photo: true,
                    },
                },
            },
        });

        return users;
    },
    createUser: async (userData) => {
        return await prisma.users.create({
            data: {
                ...userData,
                Bio: {
                    create: {
                        main_inf: { create: {} },
                        Base_inf: { create: {} },
                        Lifestyle: { create: {} },
                        Photo: {
                            create: [
                                {
                                    url: "",
                                    is_profile_pic: true,
                                },
                                {
                                    url: "",
                                    is_profile_pic: true,
                                },
                            ],
                        },
                    }, // Tạo một Bio trống
                },
            },
        });
    },
    updateUserById: async (userId, user) => {
        const userUpdated = await prisma.users.update({
            where: {
                id: parseInt(userId),
            },
            data: user,
            include: {
                Bio: {
                    include: {
                        main_inf: true,
                        Base_inf: true,
                        Lifestyle: true,
                        Photo: true,
                    },
                },
            },
        });

        return userUpdated;
    },
    updateUserEmailVerifiedStatus: async (userId, isVerified) => {
        return await prisma.users.update({
            where: { id: userId },
            data: { is_verified: isVerified },
        });
    },
};

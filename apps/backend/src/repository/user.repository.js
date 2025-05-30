import prisma from "../prisma/client.js";

export const userRepository = {
    findUserByEmail: (email) => {
        return prisma.users.findUnique({
            where: { email },
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
                user_favorites: true,
            },
        });
    },
    findUserById: (id) => {
        return prisma.users.findUnique({
            where: { id: parseInt(id) },
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
                user_favorites: true,
            },
        });
    },
    getUsers: (filters = {}, usersIdMatched = []) => {
        const {
            languageIds,
            educationIds,
            zodiacIds,
            characterIds,
            comunicateStyleIds,
            loveLanguageIds,
            futureFamilyIds,
            sexualOrientationIds,
            petIds,
            dietIds,
            sleepIds,
            snuIds,
            searchingForIds,
        } = filters;

        return prisma.users.findMany({
            where: {
                AND: {
                    id: {
                        notIn: usersIdMatched,
                    },
                    Bio: {
                        main_inf: {
                            Language: {
                                id: {
                                    in: languageIds,
                                },
                            },
                            Education: {
                                id: {
                                    in: educationIds,
                                },
                            },
                        },
                        Base_inf: {
                            Zodiac: {
                                id: {
                                    in: zodiacIds,
                                },
                            },
                            Character: {
                                id: {
                                    in: characterIds,
                                },
                            },
                            Communicate_style: {
                                id: {
                                    in: comunicateStyleIds,
                                },
                            },
                            Love_language: {
                                id: {
                                    in: loveLanguageIds,
                                },
                            },
                            FutureFamily: {
                                id: {
                                    in: futureFamilyIds,
                                },
                            },
                            Sexual_orientation: {
                                id: {
                                    in: sexualOrientationIds,
                                },
                            },
                        },
                        Lifestyle: {
                            Pet: {
                                id: {
                                    in: petIds,
                                },
                            },
                            Diet: {
                                id: {
                                    in: dietIds,
                                },
                            },
                            Sleep: {
                                id: {
                                    in: sleepIds,
                                },
                            },
                            SNU: {
                                id: {
                                    in: snuIds,
                                },
                            },
                        },
                        Searchingfor: {
                            id: {
                                in: searchingForIds,
                            },
                        },
                    },
                },
            },
            include: {
                Bio: {
                    include: {
                        main_inf: {
                            include: {
                                Language: {},
                                Religion: true,
                                Career: true,
                                Education: {},
                            },
                        },
                        Base_inf: {
                            include: {
                                Zodiac: {},
                                Character: {},
                                Communicate_style: {},
                                Love_language: {},
                                FutureFamily: {},
                                Sexual_orientation: {},
                            },
                        },
                        Lifestyle: {
                            include: {
                                Pet: {},
                                Diet: {},
                                Sleep: {},
                                SNU: {},
                            },
                        },
                        Photo: true,
                        Searchingfor: {},
                    },
                },
                user_favorites: {},
            },
        });
    },
    createUser: (userData) => {
        return prisma.users.create({
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
                    },
                },
            },
        });
    },
    updateUserById: async (userId, user, favorites) => {
        await prisma.user_favorite.deleteMany({
            where: { user_id: userId },
        });
        if (favorites?.length > 0) {
            await prisma.user_favorite.createMany({
                data: favorites.map((favoriteId) => ({
                    user_id: parseInt(userId),
                    favorite_id: favoriteId,
                })),
            });
        }
        const userUpdated = await prisma.users.update({
            where: {
                id: parseInt(userId),
            },
            data: user,
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
                user_favorites: true,
            },
        });

        return userUpdated;
    },
    updateUserEmailVerifiedStatus: (userId, isVerified) => {
        return prisma.users.update({
            where: { id: userId },
            data: { is_verified: isVerified },
        });
    },
};

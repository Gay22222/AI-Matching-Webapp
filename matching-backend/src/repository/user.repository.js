import prisma from '../prisma/client.js';
import logger from '../utils/logger.js';

export const userRepository = {
    async findUserByEmail(email) {
        try {
            logger.info(`Fetching user by email ${email}`);
            return await prisma.users.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    display_name: true,
                    password: true,
                    gender: true,
                    preferred_gender: true,
                    status: true,
                    is_verified: true,
                    is_full_information: true,
                    Bio: {
                        select: {
                            id: true,
                            name: true,
                            age: true,
                            status: true,
                            about_me: true,
                            main_inf: {
                                select: {
                                    height: true,
                                    location: true,
                                    Language: { select: { id: true, name: true } },
                                    Religion: { select: { id: true, name: true } },
                                    Career: { select: { id: true, name: true } },
                                    Education: { select: { id: true, name: true } }
                                }
                            },
                            Base_inf: {
                                select: {
                                    Zodiac: { select: { id: true, name: true } },
                                    Character: { select: { id: true, name: true } },
                                    Communicate_style: { select: { id: true, name: true } },
                                    Love_language: { select: { id: true, name: true } },
                                    FutureFamily: { select: { id: true, name: true } },
                                    Sexual_orientation: { select: { id: true, name: true } }
                                }
                            },
                            Lifestyle: {
                                select: {
                                    drink: true,
                                    smoke: true,
                                    train: true,
                                    Pet: { select: { id: true, name: true } },
                                    Diet: { select: { id: true, name: true } },
                                    Sleep: { select: { id: true, name: true } },
                                    SNU: { select: { id: true, name: true } }
                                }
                            },
                            Photo: { select: { id: true, url: true, is_profile_pic: true } },
                            Searchingfor: { select: { id: true, name: true } }
                        }
                    },
                    user_favorites: { select: { favorite_id: true } }
                }
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, 'Error fetching user by email');
            throw error;
        }
    },
    async findUserById(id) {
        try {
            logger.info(`Fetching user by id ${id}`);
            const parsedId = parseInt(id);
            if (isNaN(parsedId)) {
                throw new Error(`Invalid user ID: ${id}`);
            }
            return await prisma.users.findUnique({
                where: { id: parsedId },
                select: {
                    id: true,
                    email: true,
                    display_name: true,
                    gender: true,
                    preferred_gender: true,
                    is_full_information: true,
                    Bio: {
                        select: {
                            id: true,
                            name: true,
                            age: true,
                            about_me: true,
                            main_inf: {
                                select: {
                                    height: true,
                                    location: true,
                                    Language: { select: { id: true, name: true } },
                                    Religion: { select: { id: true, name: true } },
                                    Career: { select: { id: true, name: true } },
                                    Education: { select: { id: true, name: true } }
                                }
                            },
                            Base_inf: {
                                select: {
                                    Zodiac: { select: { id: true, name: true } },
                                    Character: { select: { id: true, name: true } },
                                    Communicate_style: { select: { id: true, name: true } },
                                    Love_language: { select: { id: true, name: true } },
                                    FutureFamily: { select: { id: true, name: true } },
                                    Sexual_orientation: { select: { id: true, name: true } }
                                }
                            },
                            Lifestyle: {
                                select: {
                                    drink: true,
                                    smoke: true,
                                    train: true,
                                    Pet: { select: { id: true, name: true } },
                                    Diet: { select: { id: true, name: true } },
                                    Sleep: { select: { id: true, name: true } },
                                    SNU: { select: { id: true, name: true } }
                                }
                            },
                            Photo: { select: { id: true, url: true, is_profile_pic: true } },
                            Searchingfor: { select: { id: true, name: true } }
                        }
                    },
                    user_favorites: { select: { favorite_id: true } }
                }
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, `Error fetching user by id ${id}`);
            throw error;
        }
    },
    async getUsers(filters = {}, usersIdMatched = []) {
        try {
            logger.info(`Fetching users with filters: ${JSON.stringify(filters)}`);
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
                search,
                gender,
                ageMin,
                ageMax,
                currentUserId
            } = filters;

            let where = {
                id: {
                    notIn: usersIdMatched,
                    not: currentUserId ? parseInt(currentUserId) : undefined // Loại bỏ userId trùng
                },
            };

            if (search) {
                where.OR = [
                    { display_name: { contains: search, mode: "insensitive" } },
                    { Bio: { name: { contains: search, mode: "insensitive" } } },
                ];
            }

            if (gender) {
                where.gender = gender;
            }

            if (ageMin || ageMax) {
                where.Bio = {
                    ...where.Bio,
                    age: {
                        gte: parseInt(ageMin) || 18,
                        lte: parseInt(ageMax) || 100,
                    },
                };
            }

            if (languageIds || educationIds || zodiacIds || characterIds || comunicateStyleIds ||
                loveLanguageIds || futureFamilyIds || sexualOrientationIds || petIds || dietIds ||
                sleepIds || snuIds || searchingForIds) {
                where.Bio = {
                    ...where.Bio,
                    main_inf: {
                        Language: languageIds ? { id: { in: languageIds } } : undefined,
                        Education: educationIds ? { id: { in: educationIds } } : undefined
                    },
                    Base_inf: {
                        Zodiac: zodiacIds ? { id: { in: zodiacIds } } : undefined,
                        Character: characterIds ? { id: { in: characterIds } } : undefined,
                        Communicate_style: comunicateStyleIds ? { id: { in: comunicateStyleIds } } : undefined,
                        Love_language: loveLanguageIds ? { id: { in: loveLanguageIds } } : undefined,
                        FutureFamily: futureFamilyIds ? { id: { in: futureFamilyIds } } : undefined,
                        Sexual_orientation: sexualOrientationIds ? { id: { in: sexualOrientationIds } } : undefined
                    },
                    Lifestyle: {
                        Pet: petIds ? { id: { in: petIds } } : undefined,
                        Diet: dietIds ? { id: { in: dietIds } } : undefined,
                        Sleep: sleepIds ? { id: { in: sleepIds } } : undefined,
                        SNU: snuIds ? { id: { in: snuIds } } : undefined
                    },
                    Searchingfor: searchingForIds ? { id: { in: searchingForIds } } : undefined
                };
            }

            return await prisma.users.findMany({
                where,
                take: 50,
                select: {
                    id: true,
                    email: true,
                    display_name: true,
                    gender: true,
                    preferred_gender: true,
                    is_full_information: true,
                    Bio: {
                        select: {
                            id: true,
                            name: true,
                            age: true,
                            about_me: true,
                            main_inf: {
                                select: {
                                    height: true,
                                    location: true,
                                    Language: { select: { id: true, name: true } },
                                    Religion: { select: { id: true, name: true } },
                                    Career: { select: { id: true, name: true } },
                                    Education: { select: { id: true, name: true } }
                                }
                            },
                            Base_inf: {
                                select: {
                                    Zodiac: { select: { id: true, name: true } },
                                    Character: { select: { id: true, name: true } },
                                    Communicate_style: { select: { id: true, name: true } },
                                    Love_language: { select: { id: true, name: true } },
                                    FutureFamily: { select: { id: true, name: true } },
                                    Sexual_orientation: { select: { id: true, name: true } }
                                }
                            },
                            Lifestyle: {
                                select: {
                                    drink: true,
                                    smoke: true,
                                    train: true,
                                    Pet: { select: { id: true, name: true } },
                                    Diet: { select: { id: true, name: true } },
                                    Sleep: { select: { id: true, name: true } },
                                    SNU: { select: { id: true, name: true } }
                                }
                            },
                            Photo: { select: { id: true, url: true, is_profile_pic: true } },
                            Searchingfor: { select: { id: true, name: true } }
                        }
                    },
                    user_favorites: { select: { favorite_id: true } }
                }
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, 'Error fetching users');
            throw error;
        }
    },
    async createUser(userData) {
        try {
            logger.info('Creating new user');
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
                                    { url: '', is_profile_pic: true },
                                    { url: '', is_profile_pic: false }
                                ]
                            }
                        }
                    }
                }
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, 'Error creating user');
            throw error;
        }
    },
    async updateUserById(userId, user, favorites) {
        try {
            logger.info(`Updating user ${userId}`);
            await prisma.user_favorite.deleteMany({ where: { user_id: userId } });
            if (favorites?.length > 0) {
                await prisma.user_favorite.createMany({
                    data: favorites.map(favoriteId => ({
                        user_id: parseInt(userId),
                        favorite_id: favoriteId
                    }))
                });
            }
            return await prisma.users.update({
                where: { id: parseInt(userId) },
                data: user,
                select: {
                    id: true,
                    email: true,
                    display_name: true,
                    gender: true,
                    preferred_gender: true,
                    is_full_information: true,
                    Bio: {
                        select: {
                            id: true,
                            name: true,
                            age: true,
                            about_me: true,
                            main_inf: {
                                select: {
                                    height: true,
                                    location: true,
                                    Language: { select: { id: true, name: true } },
                                    Religion: { select: { id: true, name: true } },
                                    Career: { select: { id: true, name: true } },
                                    Education: { select: { id: true, name: true } }
                                }
                            },
                            Base_inf: {
                                select: {
                                    Zodiac: { select: { id: true, name: true } },
                                    Character: { select: { id: true, name: true } },
                                    Communicate_style: { select: { id: true, name: true } },
                                    Love_language: { select: { id: true, name: true } },
                                    FutureFamily: { select: { id: true, name: true } },
                                    Sexual_orientation: { select: { id: true, name: true } }
                                }
                            },
                            Lifestyle: {
                                select: {
                                    drink: true,
                                    smoke: true,
                                    train: true,
                                    Pet: { select: { id: true, name: true } },
                                    Diet: { select: { id: true, name: true } },
                                    Sleep: { select: { id: true, name: true } },
                                    SNU: { select: { id: true, name: true } }
                                }
                            },
                            Photo: { select: { id: true, url: true, is_profile_pic: true } },
                            Searchingfor: { select: { id: true, name: true } }
                        }
                    },
                    user_favorites: { select: { favorite_id: true } }
                }
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, 'Error updating user');
            throw error;
        }
    },
    async updateUserEmailVerifiedStatus(userId, isVerified) {
        try {
            logger.info(`Updating email verification status for user ${userId}`);
            return await prisma.users.update({
                where: { id: parseInt(userId) },
                data: { is_verified: isVerified }
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, 'Error updating email verification status');
            throw error;
        }
    }
};
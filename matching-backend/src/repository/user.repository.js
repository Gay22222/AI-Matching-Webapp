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
    async getUsers(filters, usersIdMatched = []) {
  try {
    const {
      languageIds,
      educationIds,
      zodiacIds,
      characterIds,
      comunicateStyleIds, // Lưu ý: sửa thành communicateStyleIds nếu cần
      loveLanguageIds,
      futureFamilyIds,
      sexualOrientationIds,
      petIds,
      dietIds,
      sleepIds,
      snuIds,
      searchingForIds,
      favoriteIds, // Thêm favoriteIds
      search,
      gender,
      ageMin,
      ageMax,
      currentUserId,
      page = 1,
      limit = 10,
    } = filters;

    const where = {
      id: { not: currentUserId }, // Loại trừ người dùng hiện tại
      NOT: { id: { in: usersIdMatched } }, // Loại trừ các user đã được liked
      ...(gender && { gender }),
      ...(search && {
        OR: [
          { display_name: { contains: search, mode: 'insensitive' } },
          { Bio: { about_me: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(ageMin && { Bio: { age: { gte: ageMin } } }),
      ...(ageMax && { Bio: { age: { lte: ageMax } } }),
      ...(languageIds?.length > 0 && {
        Bio: { main_inf: { language_id: { in: languageIds } } },
      }),
      ...(educationIds?.length > 0 && {
        Bio: { main_inf: { education_id: { in: educationIds } } },
      }),
      ...(zodiacIds?.length > 0 && {
        Bio: { Base_inf: { zodiac_id: { in: zodiacIds } } },
      }),
      ...(characterIds?.length > 0 && {
        Bio: { Base_inf: { character_id: { in: characterIds } } },
      }),
      ...(comunicateStyleIds?.length > 0 && {
        Bio: { Base_inf: { communicate_style_id: { in: comunicateStyleIds } } },
      }),
      ...(loveLanguageIds?.length > 0 && {
        Bio: { Base_inf: { love_language_id: { in: loveLanguageIds } } },
      }),
      ...(futureFamilyIds?.length > 0 && {
        Bio: { Base_inf: { future_family_id: { in: futureFamilyIds } } },
      }),
      ...(sexualOrientationIds?.length > 0 && {
        Bio: { Base_inf: { sexual_orientation_id: { in: sexualOrientationIds } } },
      }),
      ...(petIds?.length > 0 && {
        Bio: { Lifestyle: { pet_id: { in: petIds } } },
      }),
      ...(dietIds?.length > 0 && {
        Bio: { Lifestyle: { diet_id: { in: dietIds } } },
      }),
      ...(sleepIds?.length > 0 && {
        Bio: { Lifestyle: { sleep_id: { in: sleepIds } } },
      }),
      ...(snuIds?.length > 0 && {
        Bio: { Lifestyle: { snu_id: { in: snuIds } } },
      }),
      ...(searchingForIds?.length > 0 && {
        Bio: { searching_for_id: { in: searchingForIds } },
      }),
      ...(favoriteIds?.length > 0 && {
        user_favorites: { some: { favorite_id: { in: favoriteIds } } }, // Lọc theo sở thích
      }),
    };

    return await prisma.users.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
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
                Education: { select: { id: true, name: true } },
              },
            },
            Base_inf: {
              select: {
                Zodiac: { select: { id: true, name: true } },
                Character: { select: { id: true, name: true } },
                Communicate_style: { select: { id: true, name: true } },
                Love_language: { select: { id: true, name: true } },
                FutureFamily: { select: { id: true, name: true } },
                Sexual_orientation: { select: { id: true, name: true } },
              },
            },
            Lifestyle: {
              select: {
                drink: true,
                smoke: true,
                train: true,
                Pet: { select: { id: true, name: true } },
                Diet: { select: { id: true, name: true } },
                Sleep: { select: { id: true, name: true } },
                SNU: { select: { id: true, name: true } },
              },
            },
            Photo: { select: { id: true, url: true, is_profile_pic: true } },
            Searchingfor: { select: { id: true, name: true } },
          },
        },
        user_favorites: { select: { favorite_id: true } },
      },
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
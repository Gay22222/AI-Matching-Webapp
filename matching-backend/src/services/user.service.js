import { userRepository } from "../repository/user.repository.js";
import { formatUser } from "../utils/user.utils.js";
import { matchService } from "./match.service.js"; 
import logger from "../utils/logger.js";

export const userService = {
  createUser: async (userData) => {
    return await userRepository.createUser(userData);
  },
  getProfileByEmail: async (email) => {
    const userRaw = await userRepository.findUserByEmail(email);
    const userFormatted = formatUser(userRaw);
    if (userFormatted) {
      delete userFormatted.password;
    }
    return userFormatted;
  },
  getProfileById: async (id) => {
    const userRaw = await userRepository.findUserById(id);
    const userFormatted = formatUser(userRaw);
    if (userFormatted) {
      delete userFormatted.password;
    }
    return userFormatted;
  },
  getUserById: async (id) => {
    const userRaw = await userRepository.findUserById(id);
    const userFormatted = formatUser(userRaw);
    if (userFormatted) {
      delete userFormatted.password;
    }
    return userFormatted;
  },
  async getAllUsersFormatted(filters, userId) {
  try {
    const filtersFormatted = {
      languageIds: filters?.languageIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      educationIds: filters?.educationIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      zodiacIds: filters?.zodiacIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      characterIds: filters?.characterIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      comunicateStyleIds: filters?.communicateStyleIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      loveLanguageIds: filters?.loveLanguageIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      futureFamilyIds: filters?.futureFamilyIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      sexualOrientationIds: filters?.sexualOrientationIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      petIds: filters?.petIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      dietIds: filters?.dietIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      sleepIds: filters?.sleepIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      snuIds: filters?.snuIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      searchingForIds: filters?.searchingForIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [],
      favoriteIds: filters?.favoriteIds?.split(",")?.map(Number).filter(n => !isNaN(n)) || [], // Thêm favoriteIds
      search: filters?.search,
      gender: filters?.gender,
      ageMin: filters?.ageMin ? parseInt(filters.ageMin) : undefined,
      ageMax: filters?.ageMax ? parseInt(filters.ageMax) : undefined,
      currentUserId: parseInt(userId),
      page: filters?.page ? parseInt(filters.page) : 1,
      limit: filters?.limit ? parseInt(filters.limit) : 10,
    };

    logger.info(`Fetching matched users for userId ${userId}`);
    const usersMatched = await matchService.getAll(userId, false);
    const usersIdMatched = usersMatched?.map((match) => match?.user_id) || [];

    logger.info(`Fetching users with filters: ${JSON.stringify(filtersFormatted)}`);
    const usersRaw = await userRepository.getUsers(filtersFormatted, usersIdMatched);

    const usersFormatted = usersRaw.map((user) => {
      const formatted = formatUser(user);
      if (formatted) {
        delete formatted.password;
      }
      return formatted;
    });

    logger.info(`Found ${usersFormatted.length} users after filtering`);
    return usersFormatted;
  } catch (error) {
    logger.error({ error, stack: error.stack }, 'Error in getAllUsersFormatted');
    throw error;
  }
},
  updateUserById: async (userId, user) => {
    const {
      displayName,
      password,
      gender,
      preferredGender,
      name,
      age,
      aboutMe,
      height,
      location,
      birthday,
      languageId,
      religionId,
      careerId,
      educationId,
      zodiacId,
      characterId,
      communicateStyleId,
      loveLanguageId,
      futureFamilyId,
      drink,
      smoke,
      train,
      petId,
      dietId,
      sleepId,
      snuId,
      photos,
      favorites,
      maxRadius,
    } = user;

    if (photos?.length > 0) {
      const profilePicCount = photos.filter(p => p.is_profile_pic).length;
      if (profilePicCount > 1) {
        throw new Error("Chỉ được phép có tối đa một ảnh đại diện");
      }
    }

    const photoUpdate = photos?.length > 0
      ? {
          Photo: {
            updateMany: photos.map((photo) => ({
              where: { id: photo.id },
              data: {
                url: photo.url,
                is_profile_pic: photo.is_profile_pic,
              },
            })),
          },
        }
      : {};

    const data = {
      display_name: displayName,
      gender,
      preferred_gender: preferredGender,
      is_full_information: true,
      birthday,
      Bio: {
        update: {
          name,
          age,
          about_me: aboutMe,
          address: location,
          min_radius: 1,
          max_radius: maxRadius,
          main_inf: {
            update: {
              height,
              location,
              Language: languageId ? { connect: { id: parseInt(languageId) } } : undefined,
              Religion: religionId ? { connect: { id: parseInt(religionId) } } : undefined,
              Career: careerId ? { connect: { id: parseInt(careerId) } } : undefined,
              Education: educationId ? { connect: { id: parseInt(educationId) } } : undefined,
            },
          },
          Base_inf: {
            update: {
              Zodiac: zodiacId ? { connect: { id: parseInt(zodiacId) } } : undefined,
              Character: characterId ? { connect: { id: parseInt(characterId) } } : undefined,
              Communicate_style: communicateStyleId ? { connect: { id: parseInt(communicateStyleId) } } : undefined,
              Love_language: loveLanguageId ? { connect: { id: parseInt(loveLanguageId) } } : undefined,
              FutureFamily: futureFamilyId ? { connect: { id: parseInt(futureFamilyId) } } : undefined,
            },
          },
          Lifestyle: {
            update: {
              drink,
              smoke,
              train,
              Pet: petId ? { connect: { id: parseInt(petId) } } : undefined,
              Diet: dietId ? { connect: { id: parseInt(dietId) } } : undefined,
              Sleep: sleepId ? { connect: { id: parseInt(sleepId) } } : undefined,
              SNU: snuId ? { connect: { id: parseInt(snuId) } } : undefined,
            },
          },
          ...photoUpdate,
        },
      },
    };

    return await userRepository.updateUserById(userId, data, favorites);
  },
  updateUserEmailVerifiedStatus: async (userId, isVerified) => {
    return await userRepository.updateUserEmailVerifiedStatus(userId, isVerified);
  },
};
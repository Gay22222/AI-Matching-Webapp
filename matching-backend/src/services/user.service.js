import { userRepository } from "../repository/user.repository.js";
import { formatUser } from "../utils/user.utils.js";
import { matchService } from "./match.service.js";

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
    getAllUsersFormatted: async (filters, userId) => {
        const filtersFormatted = {
            languageIds: filters?.["language"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            educationIds: filters?.["education"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            zodiacIds: filters?.["zodiac"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            characterIds: filters?.["character"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            comunicateStyleIds: filters?.["communicate"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            loveLanguageIds: filters?.["lovelanguage"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            futureFamilyIds: filters?.["futurefamily"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            sexualOrientationIds: filters?.["sexOrientation"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            petIds: filters?.["pet"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            dietIds: filters?.["diet"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            sleepIds: filters?.["sleep"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            snuIds: filters?.["sns"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            searchingForIds: filters?.["searchingfor"]?.split(",")?.map(Number).filter(n => !isNaN(n)),
            search: filters?.search,
            gender: filters?.gender,
            ageMin: filters?.ageMin ? parseInt(filters.ageMin) : undefined,
            ageMax: filters?.ageMax ? parseInt(filters.ageMax) : undefined,
            currentUserId: filters?.currentUserId ? parseInt(filters.currentUserId) : undefined,
        };

        const usersMatched = await matchService.getAll(userId, false);
        const usersIdMatched = usersMatched?.map((match) => match?.user_id) || [];

        const usersRaw = await userRepository.getUsers(
            filtersFormatted,
            usersIdMatched
        );

        const usersFormatted = usersRaw.map((user) => {
            const formatted = formatUser(user);
            if (formatted) {
                delete formatted.password;
            }
            return formatted;
        });
        return usersFormatted;
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

        // Cập nhật is_profile_pic trong cơ sở dữ liệu
        if (photos?.length > 0) {
            await prisma.photo.updateMany({
                where: { bio_id: user.bioId },
                data: { is_profile_pic: false }
            });
            await prisma.photo.update({
                where: { id: photos[0]?.id },
                data: { is_profile_pic: true }
            });
        }

        const photoUpdate =
            photos?.length > 0
                ? {
                      Photo: {
                          updateMany: photos?.map((photo, index) => ({
                              where: { id: photo?.id || undefined },
                              data: {
                                  url: photo?.url,
                                  is_profile_pic: index === 0,
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
        return await userRepository.updateUserEmailVerifiedStatus(
            userId,
            isVerified
        );
    },
};
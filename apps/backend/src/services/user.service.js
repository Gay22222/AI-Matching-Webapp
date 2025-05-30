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
            // delete userFormatted.password;
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
    getAllUsersFormatted: async (filters, userId) => {
        const filtersFormatted = {
            languageIds: filters?.["language"]?.split(",")?.map(Number),
            educationIds: filters?.["education"]?.split(",")?.map(Number),
            zodiacIds: filters?.["zodiac"]?.split(",")?.map(Number),
            characterIds: filters?.["character"]?.split(",")?.map(Number),
            comunicateStyleIds: filters?.["communicate"]
                ?.split(",")
                ?.map(Number),
            loveLanguageIds: filters?.["lovelanguage"]?.split(",")?.map(Number),
            futureFamilyIds: filters?.["futurefamily"]?.split(",")?.map(Number),
            sexualOrientationIds: filters?.["sexOrientation"]
                ?.split(",")
                ?.map(Number),
            petIds: filters?.["pet"]?.split(",")?.map(Number),
            dietIds: filters?.["diet"]?.split(",")?.map(Number),
            sleepIds: filters?.["sleep"]?.split(",")?.map(Number),
            snuIds: filters?.["sns"]?.split(",")?.map(Number),
            searchingForIds: filters?.["searchingfor"]?.split(",")?.map(Number),
        };

        const usersMatched = await matchService.getAll(userId, false);
        const usersIdMatched = usersMatched?.map((match) => match?.user_id);

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

        const photoUpdate =
            photos?.length > 0
                ? {
                      Photo: {
                          updateMany: photos?.map((photo) => ({
                              where: { id: photo?.id },
                              data: {
                                  url: photo?.avatarUrl,
                                  is_profile_pic: photo?.isProfilePic,
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
                            Language: {
                                connect: { id: parseInt(languageId) },
                            },
                            Religion: {
                                connect: { id: parseInt(religionId) },
                            },
                            Career: {
                                connect: { id: parseInt(careerId) },
                            },
                            Education: {
                                connect: { id: parseInt(educationId) },
                            },
                        },
                    },
                    Base_inf: {
                        update: {
                            Zodiac: {
                                connect: { id: parseInt(zodiacId) },
                            },
                            Character: {
                                connect: { id: parseInt(characterId) },
                            },
                            Communicate_style: {
                                connect: {
                                    id: parseInt(communicateStyleId),
                                },
                            },
                            Love_language: {
                                connect: { id: parseInt(loveLanguageId) },
                            },
                            FutureFamily: {
                                connect: { id: parseInt(futureFamilyId) },
                            },
                        },
                    },
                    Lifestyle: {
                        update: {
                            drink,
                            smoke,
                            train,
                            Pet: {
                                connect: { id: parseInt(petId) },
                            },
                            Diet: {
                                connect: { id: parseInt(dietId) },
                            },
                            Sleep: {
                                connect: { id: parseInt(sleepId) },
                            },
                            SNU: {
                                connect: { id: parseInt(snuId) },
                            },
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

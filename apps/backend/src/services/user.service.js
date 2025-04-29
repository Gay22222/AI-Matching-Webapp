import { userRepository } from "../repository/user.repository.js";
import { formatUser } from "../utils/user.utils.js";

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
    getAllUsersFormatted: async () => {
        const usersRaw = await userRepository.getUsers();
        console.log(usersRaw);

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
            email,
            gender,
            preferredGender,
            name,
            age,
            aboutMe,
            height,
            location,
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
            password,
            email,
            gender,
            preferred_gender: preferredGender,
            Bio: {
                update: {
                    name,
                    age,
                    about_me: aboutMe,
                    main_inf: {
                        update: {
                            height,
                            location,
                            Language: {
                                connect: { id: parseInt(languageId) }, // Vietnamese
                            },
                            Religion: {
                                connect: { id: parseInt(religionId) }, // Buddhism
                            },
                            Career: {
                                connect: { id: parseInt(careerId) }, // Software Engineer
                            },
                            Education: {
                                connect: { id: parseInt(educationId) }, // Bachelor
                            },
                        },
                    },
                    Base_inf: {
                        update: {
                            Zodiac: {
                                connect: { id: parseInt(zodiacId) }, // Aries
                            },
                            Character: {
                                connect: { id: parseInt(characterId) }, // Extrovert
                            },
                            Communicate_style: {
                                connect: {
                                    id: parseInt(communicateStyleId),
                                }, // Direct
                            },
                            Love_language: {
                                connect: { id: parseInt(loveLanguageId) }, // Quality Time
                            },
                            FutureFamily: {
                                connect: { id: parseInt(futureFamilyId) }, // Want kids
                            },
                        },
                    },
                    Lifestyle: {
                        update: {
                            drink,
                            smoke,
                            train, // ????
                            Pet: {
                                connect: { id: parseInt(petId) }, // Dog lover
                            },
                            Diet: {
                                connect: { id: parseInt(dietId) }, // Vegetarian
                            },
                            Sleep: {
                                connect: { id: parseInt(sleepId) }, // Early bird
                            },
                            SNU: {
                                connect: { id: parseInt(snuId) }, // Non-smoker
                            },
                        },
                    },
                    ...photoUpdate,
                },
            },
        };
        await userRepository.updateUserById(userId, data);
    },
    updateUserEmailVerifiedStatus: async (userId, isVerified) => {
        return await userRepository.updateUserEmailVerifiedStatus(
            userId,
            isVerified
        );
    },
};

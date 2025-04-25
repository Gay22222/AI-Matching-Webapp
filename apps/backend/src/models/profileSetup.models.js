import prisma from "../prisma/client.js";

export const getProfileSetupData = async () => {
    try {
        const [
            careers,
            pets,
            languages,
            religions,
            zodiacs,
            characters,
            communicateStyles,
            education,
            diets,
            sleeps,
        ] = await Promise.all([
            prisma.career.findMany(),
            prisma.pet.findMany(),
            prisma.language.findMany(),
            prisma.religion.findMany(),
            prisma.zodiac.findMany(),
            prisma.character.findMany(),
            prisma.communicate_style.findMany(),
            prisma.education.findMany(),
            prisma.diet.findMany(),
            prisma.sleep.findMany(),
        ]);

        return {
            careers,
            pets,
            languages,
            religions,
            zodiacs,
            characters,
            communicateStyles,
            education,
            diets,
            sleeps,
        };
    } catch (error) {
        throw new Error(`Error fetching profile setup data: ${error.message}`);
    }
};

export const getProfileSetupDataByUserId = async (userId) => {
    const userProfile = await prisma.users.findUnique({
        where: { id: userId },
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

    if (!userProfile) {
        throw new Error(`User with ID ${userId} not found`);
    }

    const userProfileFormatted = {
        id: userProfile.id,
        display_name: userProfile.display_name,
        username: userProfile.username,
        email: userProfile.email,
        phone_number: userProfile.phone_number,
        birthday: userProfile.birthday,
        gender: userProfile.gender,
        preferred_gender: userProfile.preferred_gender,
        status: userProfile.status,
        time_register: userProfile.time_register,
        bio: {
            id: userProfile.Bio.id,
            status: userProfile.Bio.status,
            name: userProfile.Bio.name,
            age: userProfile.Bio.age,
            about_me: userProfile.Bio.about_me,
            main_inf: {
                height: userProfile.Bio.main_inf.height,
                location: userProfile.Bio.main_inf.location,
                language: userProfile.Bio.main_inf.Language,
                religion: userProfile.Bio.main_inf.Religion,
                career: userProfile.Bio.main_inf.Career,
                education: userProfile.Bio.main_inf.Education,
            },
            base_inf: {
                zodiac: userProfile.Bio.Base_inf.Zodiac,
                character: userProfile.Bio.Base_inf.Character,
                communicate_style: userProfile.Bio.Base_inf.Communicate_style,
                love_language: userProfile.Bio.Base_inf.Love_language,
                futureFamily: userProfile.Bio.Base_inf.FutureFamily,
            },
            lifestyle: {
                drink: userProfile.Bio.Lifestyle.drink,
                smoke: userProfile.Bio.Lifestyle.smoke,
                train: userProfile.Bio.Lifestyle.train,
                pet: userProfile.Bio.Lifestyle.Pet,
                diet: userProfile.Bio.Lifestyle.Diet,
                sleep: userProfile.Bio.Lifestyle.Sleep,
                snu: userProfile.Bio.Lifestyle.SNU,
            },
            photo: userProfile.Bio.Photo,
        },
    };
    return userProfileFormatted;
};

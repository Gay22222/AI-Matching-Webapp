import prisma from "../prisma/client.js";

export const getMetadataData = async () => {
    // Hàm helper để biến đổi name -> value
    const transformOption = (item) => ({
        id: item.id,
        value: item.name,
    });

    try {
        // Sử dụng đúng tên model từ schema.prisma
        const [
            careersData,
            petsData,
            languagesData,
            religionsData,
            zodiacsData,
            charactersData,
            communicateStylesData, // Đã sửa tên model
            educationsData,
            dietsData,
            sleepsData,
            loveLanguagesData, // Đã sửa tên model và thêm vào
            futureFamiliesData,
            snusData,
        ] = await Promise.all([
            prisma.career.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.pet.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.language.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.religion.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.zodiac.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.character.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.communicate_style.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }), // <<< Sửa ở đây
            prisma.education.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.diet.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.sleep.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.love_language.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }), // <<< Sửa ở đây và đã thêm
            prisma.futureFamily.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
            prisma.SNU.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            }),
        ]);

        // Trả về dữ liệu đã biến đổi
        return {
            zodiacs: zodiacsData.map(transformOption),
            languages: languagesData.map(transformOption),
            religions: religionsData.map(transformOption),
            careers: careersData.map(transformOption),
            educations: educationsData.map(transformOption),
            characters: charactersData.map(transformOption),
            communicateStyles: communicateStylesData.map(transformOption),
            loveLanguages: loveLanguagesData.map(transformOption),
            futureFamilies: futureFamiliesData.map(transformOption),
            pets: petsData.map(transformOption),
            diets: dietsData.map(transformOption),
            sleeps: sleepsData.map(transformOption),
            snus: snusData.map(transformOption),
        };
    } catch (error) {
        console.error("Error fetching metadata in service:", error);
        // Bạn có thể muốn ghi log chi tiết hơn hoặc xử lý lỗi cụ thể
        throw new Error("Could not fetch metadata");
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

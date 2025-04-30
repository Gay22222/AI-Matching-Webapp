import prisma from "../prisma/client.js";

export const metadataRepository = {
    get: async () => {
        // Hàm helper để biến đổi name -> value
        const transformOption = (item) => ({
            id: item.id,
            value: item.name,
        });

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
    },
};

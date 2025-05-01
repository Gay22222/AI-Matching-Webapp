export default async function seedPet(prisma) {
    await prisma.pet.createMany({
        data: [
            {
                name: "Chó",
                description: "Thân thiện và trung thành.",
            },
            {
                name: "Mèo",
                description: "Độc lập và tò mò.",
            },
            {
                name: "Cá",
                description: "Yên bình và dễ chăm sóc.",
            },
            {
                name: "Chim",
                description: "Biết hót và có thể bay.",
            },
        ],
    });
}

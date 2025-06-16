export default async function seedLanguages(prisma) {
    await prisma.language.createMany({
        data: [
            { name: "Vietnamese" },
            { name: "English" },
            { name: "Japanese" },
        ],
        skipDuplicates: true,
    });
}

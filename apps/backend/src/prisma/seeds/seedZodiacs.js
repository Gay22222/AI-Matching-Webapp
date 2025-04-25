export default async function seedZodiacs(prisma) {
    await prisma.zodiac.createMany({
        data: [
            {
                name: "Aries",
                description: "Courageous, determined, confident.",
            },
            {
                name: "Taurus",
                description: "Reliable, patient, practical.",
            },
            {
                name: "Gemini",
                description: "Gentle, affectionate, curious.",
            },
            {
                name: "Cancer",
                description: "Tenacious, highly imaginative, loyal.",
            },
            {
                name: "Leo",
                description: "Creative, passionate, generous.",
            },
        ],
    });
}

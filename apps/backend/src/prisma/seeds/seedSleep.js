export default async function seedSleep(prisma) {
    await prisma.sleep.createMany({
        data: [
            {
                name: "Early Bird",
                description: "Wakes up early and active in the morning.",
            },
            {
                name: "Night Owl",
                description: "Stays up late and active at night.",
            },
        ],
    });
}

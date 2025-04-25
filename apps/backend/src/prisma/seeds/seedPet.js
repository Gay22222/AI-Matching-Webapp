export default async function seedPet(prisma) {
    await prisma.pet.createMany({
        data: [
            { name: "Dog", description: "Friendly and loyal." },
            { name: "Cat", description: "Independent and curious." },
            { name: "Fish", description: "Peaceful and easy to care for." },
            { name: "Bird", description: "Can sing and fly." },
        ],
    });
}

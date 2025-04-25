export default async function seedReligions(prisma) {
    await prisma.religion.createMany({
        data: [
            {
                name: "Buddhism",
                description:
                    "A spiritual tradition focused on personal spiritual development.",
            },
            {
                name: "Christianity",
                description:
                    "A monotheistic religion based on the life and teachings of Jesus Christ.",
            },
            {
                name: "Islam",
                description:
                    "A monotheistic faith revealed through Prophet Muhammad.",
            },
            {
                name: "Hinduism",
                description:
                    "A major religious and cultural tradition of South Asia.",
            },
        ],
    });
}

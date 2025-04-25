export default async function seedCareer(prisma) {
    await prisma.career.createMany({
        data: [
            {
                name: "Software Engineer",
                description: "Designs and develops software systems.",
            },
            { name: "Teacher", description: "Educates students." },
            { name: "Doctor", description: "Practices medicine." },
            { name: "Entrepreneur", description: "Runs their own business." },
        ],
    });
}

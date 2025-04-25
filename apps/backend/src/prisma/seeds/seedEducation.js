export default async function seedEducation(prisma) {
    await prisma.education.createMany({
        data: [
            {
                name: "High School",
                description: "Completed secondary education.",
            },
            {
                name: "Bachelor's Degree",
                description: "Undergraduate academic degree.",
            },
            {
                name: "Master's Degree",
                description: "Postgraduate academic degree.",
            },
            { name: "PhD", description: "Doctor of Philosophy." },
        ],
    });
}

export default async function seedSleep(prisma) {
    await prisma.sleep.createMany({
        data: [
            {
                name: "Người dậy sớm",
                description: "Thức dậy sớm và năng động vào buổi sáng.",
            },
            {
                name: "Cú đêm",
                description: "Thường thức khuya và hoạt động vào ban đêm.",
            },
        ],
    });
}

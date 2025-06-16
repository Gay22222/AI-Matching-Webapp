const seedFutureFamily = async (prisma) => {
    await prisma.futureFamily.createMany({
        data: [
            { name: "Muốn có con" },
            { name: "Chưa muốn có con" },
            { name: "Không muốn con" },
        ],
    });
};

export default seedFutureFamily;

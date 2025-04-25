const seedSNU = async (prisma) => {
    await prisma.sNU.createMany({
        data: [{ name: "Có" }, { name: "Không" }, { name: "Tuỳ đối tượng" }],
    });
};

export default seedSNU;

const seedDiet = async (prisma) => {
    await prisma.diet.createMany({
        data: [{ name: "Ăn chay" }, { name: "Ăn mặn" }, { name: "Ăn kiêng" }],
    });
};

export default seedDiet;

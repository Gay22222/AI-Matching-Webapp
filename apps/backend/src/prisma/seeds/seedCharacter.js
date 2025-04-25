const seedCharacter = async (prisma) => {
    await prisma.character.createMany({
        data: [
            { name: "Hài hước" },
            { name: "Nghiêm túc" },
            { name: "Tự tin" },
            { name: "Thân thiện" },
            { name: "Điềm đạm" },
        ],
    });
};

export default seedCharacter;

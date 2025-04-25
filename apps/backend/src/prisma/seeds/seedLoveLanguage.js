const seedLoveLanguage = async (prisma) => {
    await prisma.love_language.createMany({
        data: [
            { name: "Lời nói yêu thương" },
            { name: "Hành động quan tâm" },
            { name: "Thời gian chất lượng" },
            { name: "Quà tặng" },
            { name: "Tiếp xúc cơ thể" },
        ],
    });
};

export default seedLoveLanguage;

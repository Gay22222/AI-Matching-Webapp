const seedCommunicateStyle = async (prisma) => {
    await prisma.communicate_style.createMany({
        data: [
            { name: "Thẳng thắn" },
            { name: "Lắng nghe" },
            { name: "Biết chia sẻ" },
            { name: "Trầm lặng" },
        ],
    });
};
export default seedCommunicateStyle;

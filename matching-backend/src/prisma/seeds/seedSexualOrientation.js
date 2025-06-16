const seedSexualOrientation = async (prisma) => {
    const orientationsData = [
        {
            name: "Dị tính",
            value: "straight",
            explanation:
                "Hấp dẫn tình cảm/tình dục chủ yếu bởi người khác giới.",
        },
        {
            name: "Đồng tính",
            value: "homosexual",
            explanation:
                "Hấp dẫn tình cảm/tình dục chủ yếu bởi người cùng giới tính.",
        },
        {
            name: "Song tính",
            value: "bisexual",
            explanation:
                "Hấp dẫn tình cảm/tình dục bởi nhiều hơn một giới tính.",
        },
        {
            name: "Vô tính",
            value: "asexual",
            explanation:
                "Trải qua ít hoặc không có sự hấp dẫn tình dục đối với bất kỳ giới tính nào.",
        },
    ];

    await Promise.all(
        orientationsData.map((orientation) => {
            const description = `${orientation.value} - ${orientation.explanation}`;

            return prisma.sexual_orientation.create({
                data: {
                    name: orientation.name,
                    description: description,
                },
            });
        })
    );
};

// Export hàm seed
export default seedSexualOrientation;

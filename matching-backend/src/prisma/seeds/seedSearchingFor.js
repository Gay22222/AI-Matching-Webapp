const seedSearchingFor = async (prisma) => {
    console.log("Seeding 'searching for' options...");

    const options = [
        {
            name: "Mối quan hệ lâu dài",
            description:
                "Tìm kiếm một mối quan hệ nghiêm túc, ổn định và cam kết, có thể hướng tới tương lai xa hơn.",
        },
        {
            name: "Mối quan hệ ngắn hạn",
            description:
                "Tìm kiếm một mối quan hệ tình cảm trong thời gian ngắn hơn, có thể không quá ràng buộc về tương lai.",
        },
        {
            name: "Hẹn hò đơn giản / Tìm hiểu",
            description:
                "Muốn gặp gỡ, hẹn hò thông thường để tìm hiểu đối phương, xem mọi việc tiến triển tự nhiên.",
        },
        {
            name: "Kết bạn mới",
            description:
                "Mở rộng vòng tròn bạn bè, tìm kiếm những người bạn mới để chia sẻ sở thích, trò chuyện.",
        },
        {
            name: "Chưa chắc chắn / Để mở",
            description:
                "Chưa xác định rõ mục tiêu cụ thể, cởi mở với các khả năng khác nhau khi gặp gỡ người mới.",
        },
        {
            name: "Bạn tâm giao / Trò chuyện",
            description:
                "Tìm kiếm một người có thể kết nối sâu sắc về mặt tinh thần, để trò chuyện và chia sẻ.",
        },
        {
            name: "Bạn đồng hành (Hoạt động)",
            description:
                "Tìm người có cùng sở thích để cùng tham gia các hoạt động như du lịch, thể thao, sự kiện...",
        },
    ];

    await Promise.all(
        options.map((option) =>
            prisma.Searchingfor.create({
                data: {
                    name: option.name,
                    description: option.description,
                },
            })
        )
    );

    console.log("'Searching for' options seeded successfully.");
};

export default seedSearchingFor;

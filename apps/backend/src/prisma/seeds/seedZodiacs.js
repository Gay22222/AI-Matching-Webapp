export default async function seedZodiacs(prisma) {
    await prisma.zodiac.createMany({
        data: [
            {
                name: "Bạch Dương",
                description: "Can đảm, quyết đoán, tự tin.",
            },
            {
                name: "Kim Ngưu",
                description: "Đáng tin cậy, kiên nhẫn, thực tế.",
            },
            {
                name: "Song Tử",
                description: "Dịu dàng, tình cảm, tò mò.",
            },
            {
                name: "Cự Giải",
                description: "Kiên trì, giàu trí tưởng tượng, trung thành.",
            },
            {
                name: "Sư Tử",
                description: "Sáng tạo, đam mê, hào phóng.",
            },
            {
                name: "Xử Nữ",
                description: "Phân tích tốt, tốt bụng, chăm chỉ.",
            },
            {
                name: "Thiên Bình",
                description: "Khéo léo, công bằng, hòa đồng.",
            },
            {
                name: "Bò Cạp",
                description: "Sâu sắc, dũng cảm, đầy đam mê.",
            },
            {
                name: "Nhân Mã",
                description: "Rộng lượng, lý tưởng, hài hước.",
            },
            {
                name: "Ma Kết",
                description: "Kỷ luật, trách nhiệm, tự kiểm soát.",
            },
            {
                name: "Bảo Bình",
                description: "Tiến bộ, độc đáo, độc lập.",
            },
            {
                name: "Song Ngư",
                description: "Nhân ái, nghệ sĩ, trực giác cao.",
            },
        ],
    });
}

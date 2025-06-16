export default async function seedFavorite(prisma) {
    await prisma.favorite.createMany({
        data: [
            { name: "Cà phê" },
            { name: "Du lịch" },
            { name: "Âm nhạc" },
            { name: "Đọc sách" },
            { name: "Nấu ăn" },
            { name: "Thể thao" },
            { name: "Nhiếp ảnh" },
            { name: "Yoga" },
            { name: "Phim ảnh" },
            { name: "Mua sắm" },
            { name: "Chơi game" },
            { name: "Nghệ thuật" },
        ],
    });
}

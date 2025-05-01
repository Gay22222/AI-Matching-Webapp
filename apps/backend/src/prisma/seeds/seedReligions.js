export default async function seedReligions(prisma) {
    await prisma.religion.createMany({
        data: [
            {
                name: "Phật giáo",
                description:
                    "Một truyền thống tâm linh tập trung vào sự phát triển tinh thần cá nhân.",
            },
            {
                name: "Cơ đốc giáo",
                description:
                    "Tôn giáo độc thần dựa trên cuộc đời và lời dạy của Chúa Giê-su Ki-tô.",
            },
            {
                name: "Hồi giáo",
                description:
                    "Tôn giáo độc thần được khải thị qua Nhà tiên tri Muhammad.",
            },
            {
                name: "Ấn Độ giáo",
                description:
                    "Một truyền thống tôn giáo và văn hóa lớn của Nam Á.",
            },
        ],
    });
}

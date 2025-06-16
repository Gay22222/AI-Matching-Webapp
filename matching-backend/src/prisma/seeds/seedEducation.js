export default async function seedEducation(prisma) {
    await prisma.education.createMany({
        data: [
            {
                name: "Trung học phổ thông",
                description: "Hoàn thành chương trình giáo dục phổ thông.",
            },
            {
                name: "Cử nhân",
                description: "Bằng đại học hệ chính quy.",
            },
            {
                name: "Thạc sĩ",
                description: "Bằng sau đại học (cao học).",
            },
            {
                name: "Tiến sĩ",
                description: "Học vị Tiến sĩ chuyên ngành.",
            },
        ],
    });
}

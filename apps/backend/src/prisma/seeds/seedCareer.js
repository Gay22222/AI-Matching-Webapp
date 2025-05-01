export default async function seedCareer(prisma) {
    await prisma.career.createMany({
        data: [
            {
                name: "Kỹ sư phần mềm",
                description: "Thiết kế và phát triển hệ thống phần mềm.",
            },
            {
                name: "Giáo viên",
                description: "Giáo dục và giảng dạy học sinh.",
            },
            {
                name: "Bác sĩ",
                description: "Khám và điều trị bệnh.",
            },
            {
                name: "Doanh nhân",
                description: "Tự điều hành công việc kinh doanh của mình.",
            },
        ]ư,
    });
}

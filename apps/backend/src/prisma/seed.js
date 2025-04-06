/*----------------------------------------*/
/*Gay22222 begin-section*/
/*----------------------------------------*/

// Tạo dữ liệu mẫu để chạy thử ứng dụng
// Tạo người dùng Alice và Bob, sau đó tạo match giữa họ

import prisma from "./client.js";

async function main() {
    // 1. Tạo người dùng
    const alice = await prisma.users.create({
        data: {
            display_name: "Alice",
            username: "alice123",
            password: "hashedpass",
            email: "alice@example.com",
            gender: "female",
            preferred_gender: "male",
            birthday: new Date("1990-01-01"), // Thêm giá trị cho trường birthday
        },
    });

    const bob = await prisma.users.create({
        data: {
            display_name: "Bob",
            username: "bob123",
            password: "hashedpass",
            email: "bob@example.com",
            gender: "male",
            preferred_gender: "female",
            birthday: new Date("1992-02-02"), // Thêm giá trị cho trường birthday
        },
    });

    // 2. Tạo match giữa Alice và Bob
    await prisma.matches.create({
        data: {
            user_1_id: alice.id,
            user_2_id: bob.id,
        },
    });

    console.log(" Seed data inserted successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });

/*----------------------------------------*/
/*Gay22222 end-section*/
/*----------------------------------------*/

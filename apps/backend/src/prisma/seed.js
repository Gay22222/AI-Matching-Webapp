// prisma/seed.js
import prisma from "./client.js";

async function main() {
  // 1. Tạo người dùng
  const alice = await prisma.user.create({
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

  const bob = await prisma.user.create({
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
  await prisma.match.create({
    data: {
      user_1_id: alice.id,
      user_2_id: bob.id,
    },
  });

  console.log("✅ Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

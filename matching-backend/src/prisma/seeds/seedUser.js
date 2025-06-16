import { faker } from "@faker-js/faker";

export default async function seedUsers(prisma) {
    const numberOfUsersToCreate = 100;

    for (let i = 0; i < numberOfUsersToCreate; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = faker.internet.userName({ firstName, lastName });

        // Tạo danh sách sở thích ngẫu nhiên (1-3 sở thích)
        const favoriteCount = faker.number.int({ min: 1, max: 3 });
        const favoriteIds = new Set();
        while (favoriteIds.size < favoriteCount) {
            favoriteIds.add(faker.number.int({ min: 1, max: 12 }));
        }

        await prisma.users.create({
            data: {
                display_name: `${firstName} ${lastName}`,
                username: username,
                password: "123123",
                email: faker.internet.email({ firstName, lastName }),
                gender: faker.helpers.arrayElement(["male", "female"]),
                preferred_gender: faker.helpers.arrayElement(["male", "female", "both"]),
                status: faker.helpers.arrayElement(["online", "offline"]),
                Bio: {
                    create: {
                        name: firstName,
                        age: faker.number.int({ min: 18, max: 60 }),
                        status: "active",
                        about_me: faker.lorem.sentence(),
                        Searchingfor: {
                            connect: {
                                id: faker.number.int({ min: 1, max: 7 }), // Cập nhật max thành 7 để khớp với seedSearchingFor.js
                            },
                        },
                        main_inf: {
                            create: {
                                height: faker.number.int({ min: 150, max: 200 }).toString(),
                                location: faker.location.city(),
                                Language: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 3 }),
                                    },
                                },
                                Religion: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 4 }),
                                    },
                                },
                                Career: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 4 }),
                                    },
                                },
                                Education: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 4 }),
                                    },
                                },
                            },
                        },
                        Base_inf: {
                            create: {
                                Zodiac: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 12 }),
                                    },
                                },
                                Character: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 5 }),
                                    },
                                },
                                Communicate_style: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 4 }),
                                    },
                                },
                                Love_language: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 5 }),
                                    },
                                },
                                FutureFamily: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 3 }),
                                    },
                                },
                                Sexual_orientation: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 4 }),
                                    },
                                },
                            },
                        },
                        Lifestyle: {
                            create: {
                                drink: faker.datatype.boolean(),
                                smoke: faker.datatype.boolean(),
                                train: faker.datatype.boolean(),
                                Pet: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 4 }),
                                    },
                                },
                                Diet: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 3 }),
                                    },
                                },
                                Sleep: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 2 }),
                                    },
                                },
                                SNU: {
                                    connect: {
                                        id: faker.number.int({ min: 1, max: 3 }),
                                    },
                                },
                            },
                        },
                        Photo: {
                            create: {
                                url: faker.image.avatar(),
                                is_profile_pic: true,
                            },
                        },
                    },
                },
                user_favorites: {
                    create: Array.from(favoriteIds, (favorite_id) => ({
                        favorite_id,
                    })),
                },
            },
        });
    }
    console.log(`Created ${numberOfUsersToCreate} users with favorites.`);
}
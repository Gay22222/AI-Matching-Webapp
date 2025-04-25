export default async function seedUser(prisma) {
    await prisma.users.create({
        data: {
            display_name: "John Doe",
            username: "johndoe",
            password: "hashedpassword123",
            email: "john@example.com",
            gender: "male",
            preferred_gender: "female",
            status: "online",
            Bio: {
                create: {
                    name: "John",
                    age: 25,
                    status: "active",
                    about_me: "I love traveling and music",
                    main_inf: {
                        create: {
                            height: "180",
                            location: "Ho Chi Minh City",
                            Language: {
                                connect: { id: 1 }, // Vietnamese
                            },
                            Religion: {
                                connect: { id: 1 }, // Buddhism
                            },
                            Career: {
                                connect: { id: 1 }, // Software Engineer
                            },
                            Education: {
                                connect: { id: 1 }, // Bachelor
                            },
                        },
                    },
                    Base_inf: {
                        create: {
                            Zodiac: {
                                connect: { id: 1 }, // Aries
                            },
                            Character: {
                                connect: { id: 1 }, // Extrovert
                            },
                            Communicate_style: {
                                connect: { id: 1 }, // Direct
                            },
                            Love_language: {
                                connect: { id: 1 }, // Quality Time
                            },
                            FutureFamily: {
                                connect: { id: 1 }, // Want kids
                            },
                        },
                    },
                    Lifestyle: {
                        create: {
                            drink: false,
                            smoke: false,
                            train: true,
                            Pet: {
                                connect: { id: 1 }, // Dog lover
                            },
                            Diet: {
                                connect: { id: 1 }, // Vegetarian
                            },
                            Sleep: {
                                connect: { id: 1 }, // Early bird
                            },
                            SNU: {
                                connect: { id: 1 }, // Non-smoker
                            },
                        },
                    },
                    Photo: {
                        create: {
                            url: "https://example.com/photo.jpg",
                            is_profile_pic: true,
                        },
                    },
                },
            },
        },
        include: {
            Bio: {
                include: {
                    main_inf: true,
                    Base_inf: true,
                    Lifestyle: true,
                    Photo: true,
                },
            },
        },
    });
}

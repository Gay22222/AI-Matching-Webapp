import prisma from "../client.js";

import seedLanguages from "./seedLanguages.js";
import seedReligions from "./seedReligions.js";
import seedZodiacs from "./seedZodiacs.js";
import seedSleep from "./seedSleep.js";
import seedEducation from "./seedEducation.js";
import seedCareer from "./seedCareer.js";
import seedPet from "./seedPet.js";
import seedUser from "./seedUser.js";
import seedCharacter from "./seedCharacter.js";
import seedCommunicateStyle from "./seedCommunicateStyle.js";
import seedLoveLanguage from "./seedLoveLanguage.js";
import seedFutureFamily from "./seedFutureFamily.js";
import seedDiet from "./seedDiet.js";
import seedSNU from "./seedSNU.js";
import seedFavorite from "./seedFavorite.js";

async function resetTable(tableName) {
    await prisma.$executeRawUnsafe(`DELETE FROM \`${tableName}\``);
    await prisma.$executeRawUnsafe(
        `ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1`
    );
}

async function main() {
    console.log("🌱 Seeding database...");

    try {
        // Xoá + reset ID
        await resetTable("users");
        await resetTable("Pet");
        await resetTable("Language");
        await resetTable("Religion");
        await resetTable("Zodiac");
        await resetTable("Sleep");
        await resetTable("Education");
        await resetTable("Career");
        await resetTable("Character");
        await resetTable("Communicate_style");
        await resetTable("Love_language");
        await resetTable("FutureFamily");
        await resetTable("Diet");
        await resetTable("SNU");
        await resetTable("Favorite");

        // Seed lại
        await seedLanguages(prisma);
        await seedReligions(prisma);
        await seedZodiacs(prisma);
        await seedSleep(prisma);
        await seedEducation(prisma);
        await seedCareer(prisma);
        await seedPet(prisma);
        await seedCharacter(prisma);
        await seedCommunicateStyle(prisma);
        await seedLoveLanguage(prisma);
        await seedFutureFamily(prisma);
        await seedDiet(prisma);
        await seedSNU(prisma);
        await seedUser(prisma);
        await seedFavorite(prisma);

        console.log("✅ Done seeding!");
    } catch (err) {
        console.error("❌ Error seeding:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error("❌ Error seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

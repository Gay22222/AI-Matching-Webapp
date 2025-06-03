import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function getUserWithProfile(userId) {
  return await prisma.users.findUnique({
    where: { id: userId },
    include: {
      Bio: {
        include: {
          main_inf: { include: { Language: true, Education: true, Religion: true, Career: true } },
          Base_inf: {
            include: {
              Zodiac: true,
              Character: true,
              Communicate_style: true,
              Love_language: true,
              FutureFamily: true,
              Sexual_orientation: true,
            },
          },
          Lifestyle: {
            include: {
              Diet: true,
              Sleep: true,
              SNU: true,
              Pet: true,
            },
          },
          Searchingfor: true,
        },
      },
      user_favorites: {
        include: {
          favorite: true,
        },
      },
    },
  });
}

function mapUserToJson(user) {
  const bio = user.Bio || {};
  const main = bio.main_inf || {};
  const base = bio.Base_inf || {};
  const life = bio.Lifestyle || {};

  const favorites = user.user_favorites?.map(fav => fav.favorite.name) || [];

  return {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    email: user.email,
    birthday: user.birthday,
    age: bio.age,
    status: bio.status,
    about_me: bio.about_me,
    searching_for: bio.Searchingfor?.name,
    sexual_orientation: base.Sexual_orientation?.name,
    language: main.Language?.name,
    education: main.Education?.name,
    religion: main.Religion?.name,
    career: main.Career?.name,
    height: main.height,
    location: main.location,
    zodiac: base.Zodiac?.name,
    character: base.Character?.name,
    character_list: [base.Character?.name].filter(Boolean),
    communicate_style: base.Communicate_style?.name,
    communicate_style_list: [base.Communicate_style?.name].filter(Boolean),
    love_language: base.Love_language?.name,
    love_language_list: [base.Love_language?.name].filter(Boolean),
    future_family: base.FutureFamily?.name,
    drink: life.drink,
    smoke: life.smoke,
    train: life.train,
    diet: life.Diet?.name,
    sleep: life.Sleep?.name,
    snu: life.SNU?.name,
    pet: life.Pet?.name,
    pet_list: [life.Pet?.name].filter(Boolean),
    favorite: favorites[0] || '',
    favorite_list: favorites,
  };
}

function saveUserJsonToFile(json) {
  const dir = path.join(__dirname, '../user_data/json'); // Thay đổi đường dẫn
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
  const filePath = path.join(dir, `user_${json.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
  console.log(`📄 Saved JSON: ${filePath}`);
}

async function generateUserProfileJson(userId) {
  const user = await getUserWithProfile(userId);
  if (!user || !user.Bio) {
    console.warn(`⚠️ User ID ${userId} chưa hoàn tất hồ sơ`);
    return null;
  }
  const userJson = mapUserToJson(user);
  saveUserJsonToFile(userJson);
  return userJson;
}

export default generateUserProfileJson;
// lib/generateUserProfileJson.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function getUserWithProfile(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bio: {
        include: {
          main_inf: { include: { language: true, education: true, religion: true, career: true } },
          base_inf: {
            include: {
              zodiac: true,
              character: true,
              communicate_style: true,
              love_language: true,
              future_family: true,
              baseInfCharacters: { include: { Character: true } },
              baseInfCommunicateStyles: { include: { CommunicateStyle: true } },
              baseInfLoveLanguages: { include: { LoveLanguage: true } },
            }
          },
          lifestyle: {
            include: {
              diet: true,
              sleep: true,
              snu: true,
              pet: true,
              lifestylePets: { include: { Pet: true } },
            }
          },
          favorite: true,
          bioFavorites: { include: { Favorite: true } },
          searching_for: true,
          sexual_orientation: true,
        }
      }
    }
  });
}

function mapUserToJson(user) {
  const bio = user.bio;
  const main = bio.main_inf || {};
  const base = bio.base_inf || {};
  const life = bio.lifestyle || {};
  const favorites = bio.bioFavorites?.map(f => f.Favorite.favorite_name) || [];
  const characters = base.baseInfCharacters?.map(c => c.Character.character_name) || [];
  const commStyles = base.baseInfCommunicateStyles?.map(c => c.CommunicateStyle.name) || [];
  const loveLangs = base.baseInfLoveLanguages?.map(l => l.LoveLanguage.name) || [];
  const pets = life.lifestylePets?.map(p => p.Pet.pet_name) || [];

  return {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    email: user.email,
    birthday: user.birthday,
    age: bio.age,
    status: bio.status,
    about_me: bio.about_me,
    searching_for: bio.searching_for?.name,
    sexual_orientation: bio.sexual_orientation?.name,

    language: main.language?.name,
    education: main.education?.name,
    religion: main.religion?.name,
    career: main.career?.name,
    height: main.height,
    location: main.location,

    zodiac: base.zodiac?.zodiac_name,
    character: base.character?.character_name,
    character_list: characters,
    communicate_style: base.communicate_style?.name,
    communicate_style_list: commStyles,
    love_language: base.love_language?.name,
    love_language_list: loveLangs,
    future_family: base.future_family?.name,

    drink: life.drink,
    smoke: life.smoke,
    train: life.train,
    diet: life.diet?.diet_name,
    sleep: life.sleep?.name,
    snu: life.snu?.name,
    pet: life.pet?.pet_name,
    pet_list: pets,

    favorite: bio.favorite?.favorite_name,
    favorite_list: favorites
  };
}

function saveUserJsonToFile(json) {
  const dir = path.join(__dirname, '../user_json');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const filePath = path.join(dir, `user_${json.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
  console.log(`📄 Saved JSON: ${filePath}`);
}

async function generateUserProfileJson(userId) {
  const user = await getUserWithProfile(userId);
  if (!user || !user.bio) {
    console.warn(`⚠️ User ID ${userId} chưa hoàn tất hồ sơ`);
    return null;
  }
  const userJson = mapUserToJson(user);
  saveUserJsonToFile(userJson);
  return userJson;
}

module.exports = generateUserProfileJson;

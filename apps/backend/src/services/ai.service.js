import { PrismaClient } from '@prisma/client';
import processUserEmbedding from '../ai/pipeline/processUserEmbedding.js';
import searchTopKUsers from '../ai/weaviate/searchSimilarUsers.js';
import embedUserText from '../ai/embedding/embedUserText.js';

const prisma = new PrismaClient();

export const aiService = {
  async generateRecommendations() {
    try {
      console.log('Fetching users from database...');
      const users = await prisma.users.findMany({
        include: {
          Bio: {
            include: {
              main_inf: true,
              Base_inf: true,
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
      console.log(`Found ${users.length} users.`);

      console.log('Processing user embeddings...');
      const userUuidMap = new Map(); // Lưu ánh xạ userId -> UUID
      for (const user of users) {
        console.log(`Processing user ${user.id}...`);
        const { userId, uuid } = await processUserEmbedding(user.id);
        userUuidMap.set(userId, uuid);
      }

      console.log('Deleting existing recommendations...');
      await prisma.recommendation.deleteMany();

      console.log('Generating new recommendations...');
      for (const user of users) {
        console.log(`Generating recommendation for user ${user.id}...`);
        const favorites = user.user_favorites.map(fav => fav.favorite.name).join(', ') || 'None';
        const text = `
          Name: ${user.Bio?.name || user.display_name}
          Age: ${user.Bio?.age || 'Unknown'}
          About: ${user.Bio?.about_me || ''}
          Location: ${user.Bio?.main_inf?.location || ''}
          Height: ${user.Bio?.main_inf?.height || ''}
          Career: ${user.Bio?.main_inf?.career?.name || ''}
          Education: ${user.Bio?.main_inf?.education?.name || ''}
          Zodiac: ${user.Bio?.Base_inf?.Zodiac?.name || ''} 
          Character: ${user.Bio?.Base_inf?.Character?.name || ''} 
          Communicate Style: ${user.Bio?.Base_inf?.Communicate_style?.name || ''} 
          Love Language: ${user.Bio?.Base_inf?.Love_language?.name || ''} 
          Future Family: ${user.Bio?.Base_inf?.FutureFamily?.name || ''} 
          Sexual Orientation: ${user.Bio?.Base_inf?.Sexual_orientation?.name || ''} 
          Diet: ${user.Bio?.Lifestyle?.Diet?.name || ''}
          Sleep: ${user.Bio?.Lifestyle?.Sleep?.name || ''}
          SNU: ${user.Bio?.Lifestyle?.SNU?.name || ''}
          Pet: ${user.Bio?.Lifestyle?.Pet?.name || ''}
          Favorite: ${favorites}
          Searching For: ${user.Bio?.Searchingfor?.name || ''}
        `.trim();
        console.log('Generating embedding for user text...');
        const vector = await embedUserText(text);
        console.log('Searching similar users in Weaviate...');
        const similarUsers = await searchTopKUsers(vector, 20);

        console.log(`Found ${similarUsers.length} similar users for user ${user.id}.`);
        for (const similar of similarUsers) {
          const similarUserId = parseInt(similar.userId); // userId từ Weaviate
          await prisma.recommendation.create({
            data: {
              userId: user.id,
              recommendedUserId: similarUserId,
              score: similar._additional?.certainty || 0.5,
            },
          });
        }
      }

      console.log('Recommendations generated and saved.');
    } catch (error) {
      console.error('Error generating recommendations:', error.stack);
      throw error;
    }
  },
};
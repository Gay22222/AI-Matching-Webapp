import prisma from '../prisma/client.js';
import processUserEmbedding from '../ai/pipeline/processUserEmbedding.js';
import searchTopKUsers from '../ai/weaviate/searchSimilarUsers.js';
import embedUserText from '../ai/embedding/embedUserText.js';
import logger from '../utils/logger.js';
import pLimit from 'p-limit';

const limit = pLimit(2); // Giới hạn 2 tác vụ đồng thời

export const aiService = {
  async generateRecommendations() {
    try {
      logger.info('Starting recommendation generation');
      
      logger.info('Checking database connection');
      try {
        await prisma.$connect();
        logger.info('Database connected');
      } catch (dbError) {
        logger.error({ dbError, stack: dbError.stack }, 'Database connection error');
        throw dbError;
      }

      logger.info('Fetching all users from database');
      let users;
      try {
        users = await prisma.users.findMany({
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
                    Pet: true
                  }
                },
                Searchingfor: true
              }
            },
            user_favorites: {
              include: {
                favorite: true
              }
            }
          }
        });
      } catch (prismaError) {
        logger.error({ prismaError, stack: prismaError.stack }, 'Error fetching users');
        throw prismaError;
      }
      logger.info(`Found ${users.length} users: ${users.map(u => u.id).join(', ')}`);

      if (users.length === 0) {
        logger.warn('No users found, skipping recommendation generation');
        return;
      }

      logger.info('Processing user embeddings');
      const userUuidMap = new Map();
      await Promise.all(users.map(user => limit(async () => {
        logger.info(`Processing user ${user.id}`);
        try {
          if (!user.Bio) {
            logger.warn(`Skipping user ${user.id}: Missing Bio`);
            return;
          }
          const { userId, uuid } = await processUserEmbedding(user.id);
          userUuidMap.set(userId, uuid);
          logger.info(`Embedding processed for user ${userId}`);
        } catch (error) {
          logger.error({ error, stack: error.stack }, `Error processing embedding for user ${user.id}`);
        }
      })));

      logger.info('Deleting existing recommendations');
      try {
        await prisma.recommendation.deleteMany();
        logger.info('Recommendations deleted');
      } catch (prismaError) {
        logger.error({ prismaError, stack: prismaError.stack }, 'Error deleting recommendations');
        throw prismaError;
      }

      logger.info('Generating new recommendations');
      const userIds = users.map(u => u.id);
      for (const user of users) {
        logger.info(`Generating recommendation for user ${user.id}`);
        try {
          const favorites = user.user_favorites?.map(fav => fav.favorite?.name).join(', ') || 'None';
          const text = `
            Name: ${user.Bio?.name || user.display_name || 'Unknown'}
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
          logger.info(`Text generated for user ${user.id}: ${text.substring(0, 100)}...`);
          logger.info(`Generating embedding for user ${user.id}`);
          const vector = await embedUserText(text);
          logger.info(`Vector length: ${vector.length}`);
          logger.info(`Searching similar users for user ${user.id}`);
          const similarUsers = await searchTopKUsers(vector, 20, user.id);
          logger.info(`Found ${similarUsers.length} similar users for user ${user.id}: ${similarUsers.map(s => s.userId).join(', ')}`);
          
          const existingRecommendations = new Set();
          for (const similar of similarUsers) {
            const similarUserId = parseInt(similar.userId);
            if (!userIds.includes(similarUserId)) {
              logger.warn(`Skipping recommendation: user ${user.id} -> ${similarUserId} (invalid recommendedUserId)`);
              continue;
            }
            const score = similar._additional?.certainty || 0.5;
            if (isNaN(score) || score < 0 || score > 1) {
              logger.warn(`Skipping recommendation: user ${user.id} -> ${similarUserId} (invalid score: ${score})`);
              continue;
            }
            const recommendationKey = `${user.id}-${similarUserId}`;
            if (existingRecommendations.has(recommendationKey)) {
              logger.warn(`Skipping duplicate recommendation: user ${user.id} -> ${similarUserId}`);
              continue;
            }
            logger.info(`Creating recommendation: user ${user.id} -> ${similarUserId} with score ${score}`);
            try {
              await prisma.recommendation.create({
                data: {
                  userId: user.id,
                  recommendedUserId: similarUserId,
                  score
                }
              });
              existingRecommendations.add(recommendationKey);
            } catch (prismaError) {
              logger.error({ prismaError, stack: prismaError.stack }, `Failed to create recommendation: user ${user.id} -> ${similarUserId}`);
              continue;
            }
          }
        } catch (error) {
          logger.error({ error, stack: error.stack }, `Error generating recommendation for user ${user.id}`);
          continue;
        }
      }

      logger.info('Recommendations generated and saved');
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error generating recommendations');
      throw error;
    }
  }
};
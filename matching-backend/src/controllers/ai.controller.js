import { aiService } from '../services/ai.service.js';
import logger from '../utils/logger.js';

export const aiController = {
  async generateRecommendations(req, res) {
    try {
      logger.info('Starting recommendation generation');
      await aiService.generateRecommendations();
      logger.info('Recommendation generation completed');
      res.status(200).json({
        statusCode: 200,
        message: 'Recommendations generated successfully'
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error generating recommendations');
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message
      });
    }
  },
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      logger.info(`Fetching recommendations for user ${userId}`);
      const recommendations = await prisma.recommendation.findMany({
        where: { userId },
        include: {
          recommendedUser: {
            include: {
              Bio: {
                include: {
                  main_inf: true,
                  Base_inf: true,
                  Lifestyle: true,
                  Photo: true,
                  Searchingfor: true
                }
              },
              user_favorites: { include: { favorite: true } }
            }
          }
        }
      });
      res.status(200).json({ statusCode: 200, data: recommendations });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error getting recommendations');
      res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  }
};
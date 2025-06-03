import { aiService } from '../services/ai.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const aiController = {
  async generateRecommendations(req, res) {
    try {
      console.log('Starting recommendation generation...');
      await aiService.generateRecommendations();
      console.log('Recommendation generation completed.');
      res.status(200).json({
        statusCode: 200,
        message: 'Recommendations generated successfully',
      });
    } catch (error) {
      console.error('Error generating recommendations:', error.stack);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const recommendations = await prisma.recommendation.findMany({
        where: { userId },
        include: {
          recommendedUser: {
            select: {
              id: true,
              display_name: true,
              Bio: {
                include: {
                  Photo: { where: { is_profile_pic: true } },
                  main_inf: true,
                  Base_inf: true,
                  Lifestyle: true,
                },
              },
              user_favorites: {
                include: {
                  favorite: true,
                },
              },
            },
          },
        },
        orderBy: { score: 'desc' },
        take: 20,
      });
      res.status(200).json({
        statusCode: 200,
        data: recommendations,
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  },
};
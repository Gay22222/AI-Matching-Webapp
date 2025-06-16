import cron from 'node-cron';
import { aiService } from '../services/ai.service.js';

export function startRecommendationCron() {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running recommendation task...');
    try {
      await aiService.generateRecommendations();
      console.log('Recommendation task completed.');
    } catch (error) {
      console.error('Recommendation task failed:', error);
    }
  });
}
import generateUserProfileJson from '../data/generateUserProfileJson.js';
import convertUserJsonToText from '../data/convertUserJsonToText.js'; 
import embedUserText from '../embedding/embedUserText.js';
import { storeUserVector } from '../weaviate/storeUserVector.js';
import logger from '../../utils/logger.js';

export default async function processUserEmbedding(userId) {
  try {
    logger.info(`Processing embedding for user ${userId}`);
    
    // Tạo JSON profile
    const userJson = await generateUserProfileJson(userId);
    if (!userJson) {
      throw new Error(`Failed to generate JSON for user ${userId}`);
    }
    
    // Chuyển JSON thành text
    const text = await convertUserJsonToText(userJson);
    
    // Tạo embedding
    const vector = await embedUserText(text);
    
    // Lưu vector vào Weaviate
    const { userId: storedId, uuid } = await storeUserVector(userId, vector, text);
    
    logger.info(`Embedding processed for user ${userId}`);
    return { userId: storedId, uuid };
  } catch (error) {
    logger.error({ error, stack: error.stack }, `Error processing embedding for user ${userId}`);
    throw error;
  }
}
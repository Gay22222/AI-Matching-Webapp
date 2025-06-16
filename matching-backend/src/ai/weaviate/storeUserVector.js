import weaviate from 'weaviate-ts-client';
import logger from '../../utils/logger.js';

const client = weaviate.client({
  scheme: 'http',
  host: process.env.WEAVIATE_HOST || 'localhost:8080',
});

async function ensureSchema() {
  try {
    const schema = await client.schema.getter().do();
    const userProfileExists = schema.classes.some(c => c.class === 'UserProfile');
    if (userProfileExists) {
      logger.info('UserProfile schema already exists');
      return;
    }
    logger.info('Creating UserProfile schema');
    await client.schema.classCreator().withClass({
      class: 'UserProfile',
      properties: [
        { name: 'userId', dataType: ['int'] }, // Giữ dataType là int
        { name: 'text', dataType: ['text'] },
      ],
      vectorizer: 'none',
    }).do();
    logger.info('UserProfile schema created');
  } catch (error) {
    logger.error({ error, stack: error.stack }, 'Failed to ensure schema');
    throw error;
  }
}

export async function storeUserVector(userId, vector, text) {
    try {
        await ensureSchema();
        logger.info(`Storing vector for user ${userId}, vector length: ${vector.length}`);

        // Kiểm tra và xóa bản ghi cũ nếu tồn tại
        const existingObjects = await client.data.getter()
            .withClassName('UserProfile')
            .withWhere({
                operator: 'Equal',
                path: ['userId'],
                valueInt: parseInt(userId)
            })
            .do();

        if (existingObjects && existingObjects.length > 0) {
            for (const obj of existingObjects) {
                await client.data.deleter()
                    .withClassName('UserProfile')
                    .withId(obj._additional.id)
                    .do();
                logger.info(`Deleted existing vector for user ${userId}`);
            }
        }

        const object = {
            class: 'UserProfile',
            properties: {
                userId: parseInt(userId),
                text: text || '',
            },
            vector,
        };
        await client.data.creator()
            .withClassName('UserProfile')
            .withProperties(object.properties)
            .withVector(vector)
            .do();
        logger.info(`Vector stored for user ${userId}`);
        return { userId, uuid: userId.toString() };
    } catch (error) {
        logger.error({ error, stack: error.stack }, `Failed to store vector for user ${userId}`);
        throw error;
    }
}
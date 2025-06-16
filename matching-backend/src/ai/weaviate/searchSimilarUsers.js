import weaviate from 'weaviate-ts-client';
import retry from 'async-retry';
import logger from '../../utils/logger.js';

const client = weaviate.client({
    scheme: 'http',
    host: process.env.WEAVIATE_HOST || 'localhost:8080'
});

async function checkWeaviateConnection() {
    try {
        await client.misc.metaGetter().do();
        logger.info('Weaviate connection verified');
        return true;
    } catch (error) {
        logger.error({ error, stack: error.stack }, 'Failed to connect to Weaviate');
        return false;
    }
}

async function searchTopKUsers(vector, k = 20, excludeUserId = null) {
    try {
        if (!vector || !Array.isArray(vector) || !vector.every(num => typeof num === 'number')) {
            logger.warn('Invalid vector format');
            throw new Error('Invalid vector: must be a non-empty array of numbers');
        }

        // Kiểm tra kết nối Weaviate
        const isConnected = await checkWeaviateConnection();
        if (!isConnected) {
            throw new Error('Weaviate is not available');
        }

        logger.info(`Searching top ${k} similar users`);
        const response = await retry(
            async () => {
                let query = client.graphql
                    .get()
                    .withClassName('UserProfile')
                    .withNearVector({ vector, distance: 0.7 })
                    .withLimit(k)
                    .withFields('userId _additional { certainty distance }');

                if (excludeUserId) {
                    query = query.withWhere({
                        operator: 'NotEqual',
                        path: ['userId'],
                        valueInt: parseInt(excludeUserId)
                    });
                }

                return await query.do();
            },
            { retries: 5, factor: 2, minTimeout: 1000, maxTimeout: 5000 }
        );
        const results = response.data.Get.UserProfile || [];
        logger.info(`Found ${results.length} similar users`);

        const uniqueResults = [];
        const seenUserIds = new Set();
        for (const item of results) {
            const userId = parseInt(item.userId);
            if (!seenUserIds.has(userId)) {
                uniqueResults.push({
                    userId,
                    _additional: item._additional
                });
                seenUserIds.add(userId);
            }
        }
        logger.info(`Deduplicated to ${uniqueResults.length} unique users`);
        return uniqueResults;
    } catch (error) {
        logger.error({ error, stack: error.stack }, 'Failed to search top-k in Weaviate');
        return [];
    }
}

export default searchTopKUsers;
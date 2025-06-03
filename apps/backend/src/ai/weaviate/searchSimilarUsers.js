import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'http',
  host: process.env.WEAVIATE_HOST || 'localhost:8080',
});

async function searchTopKUsers(vector, k = 20) {
  try {
    // Kiểm tra vector
    if (!vector || !Array.isArray(vector) || !vector.every(num => typeof num === 'number')) {
      throw new Error('Invalid vector: must be a non-empty array of numbers');
    }

    const response = await client.graphql
      .get()
      .withClassName('UserProfile')
      .withNearVector({ vector })
      .withLimit(k)
      .withFields('userId text')
      .do();

    console.log(`Search top ${k} users, found: ${response.data.Get.UserProfile.length} results`);

    return response.data.Get.UserProfile || [];
  } catch (error) {
    console.error('❌ Failed to search top-k in Weaviate:', error.message, error.stack);
    return [];
  }
}

export default searchTopKUsers;
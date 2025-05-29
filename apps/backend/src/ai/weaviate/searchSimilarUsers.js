const axios = require('axios');

const WEAVIATE_ENDPOINT = 'http://localhost:8080/v1/graphql';

/**
 * @param {Array<number>} vector - vector embedding cần tìm.
 * @param {number} k - số lượng kết quả gần nhất cần trả về.
 */
async function searchTopKUsers(vector, k = 5) {
  try {
    const response = await axios.post(WEAVIATE_ENDPOINT, {
      query: `
        {
          Get {
            UserProfile(
              nearVector: {
                vector: [${vector.join(',')}]
              },
              limit: ${k}
            ) {
              userId
              text
            }
          }
        }
      `,
    });

    return response.data.data.Get.UserProfile;
  } catch (error) {
    console.error('❌ Failed to search top-k in Weaviate:', error.message);
    return [];
  }
}

module.exports = { searchTopKUsers };

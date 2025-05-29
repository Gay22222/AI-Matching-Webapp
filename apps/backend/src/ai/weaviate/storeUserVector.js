const weaviate = require('weaviate-ts-client');
const fs = require('fs');
const path = require('path');

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080', // đảm bảo Weaviate đang chạy Docker local
});

async function storeUserVector(userId, vector, text) {
  try {
    const result = await client.data
      .creator()
      .withClassName('UserProfile')
      .withId(userId.toString())
      .withProperties({
        userId,
        text,
      })
      .withVector(vector)
      .do();

    console.log('✅ Stored vector in Weaviate:', result);
  } catch (err) {
    console.error('❌ Failed to store vector:', err.message);
  }
}

module.exports = storeUserVector;

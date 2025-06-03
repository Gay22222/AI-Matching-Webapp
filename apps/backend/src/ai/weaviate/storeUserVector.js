import weaviate from 'weaviate-ts-client';
import { v5 as uuidv5 } from 'uuid';

const client = weaviate.client({
  scheme: 'http',
  host: process.env.WEAVIATE_HOST || 'localhost:8080',
});

const NAMESPACE_UUID = '123e4567-e89b-12d3-a456-426614174000';

async function ensureSchema() {
  try {
    // Kiểm tra schema có tồn tại không
    await client.schema.getter().withClassName('UserProfile').do();
    console.log('UserProfile schema already exists.');
  } catch (error) {
    console.log('Creating UserProfile schema...');
    try {
      await client.schema
        .classCreator()
        .withClass({
          class: 'UserProfile',
          properties: [
            { name: 'userId', dataType: ['int'] },
            { name: 'text', dataType: ['text'] },
          ],
          vectorizer: 'none',
        })
        .do();
      console.log('✅ UserProfile schema created.');
    } catch (schemaError) {
      console.error('❌ Failed to create schema:', schemaError.message, schemaError.stack);
      throw schemaError;
    }
  }
}

async function storeUserVector(userId, text, vector) {
  try {
    // Kiểm tra vector
    if (!vector || !Array.isArray(vector) || !vector.every(num => typeof num === 'number')) {
      throw new Error('Invalid vector: must be a non-empty array of numbers');
    }
    console.log(`Storing vector for user ${userId}, vector length: ${vector.length}`);

    // Đảm bảo schema tồn tại
    await ensureSchema();

    // Tạo UUID từ userId
    const uuid = uuidv5(userId.toString(), NAMESPACE_UUID);

    const result = await client.data
      .creator()
      .withClassName('UserProfile')
      .withId(uuid)
      .withProperties({
        userId: parseInt(userId), // Đảm bảo userId là số nguyên
        text,
      })
      .withVector(vector)
      .do();
    console.log(`✅ Stored vector for user ${userId} with UUID ${uuid}`);
    return uuid;
  } catch (err) {
    console.error(`❌ Failed to store vector for user ${userId}:`, err.message, err.stack);
    throw err;
  }
}

export default storeUserVector;
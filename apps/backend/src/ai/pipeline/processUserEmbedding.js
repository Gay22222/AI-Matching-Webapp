import generateUserProfileJson from '../data/generateUserProfileJson.js';
import convertUserJsonToText from '../data/convertUserJsonToText.js';
import embedUserText from '../embedding/embedUserText.js';
import storeUserVector from '../weaviate/storeUserVector.js';

async function processUserEmbedding(userId) {
  const json = await generateUserProfileJson(userId);
  if (!json) throw new Error(`No profile found for user ${userId}`);

  const text = convertUserJsonToText(json);
  const vector = await embedUserText(text);
  const uuid = await storeUserVector(userId, text, vector);

  console.log(`✅ Stored vector for user ${userId} with UUID ${uuid}`);
  return { userId, uuid }; // Trả về cả userId và UUID
}

export default processUserEmbedding;
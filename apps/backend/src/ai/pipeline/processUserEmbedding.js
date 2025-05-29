// lib/pipeline/processUserPipeline.js
const generateUserProfileJson = require('../data/generateUserProfileJson');
const convertUserJsonToText = require('../data/convertUserJsonToText');
const embedUserText = require('../embedding/embedUserText');
const storeUserVector = require('../weaviate/storeUserVector');

async function processUserPipeline(userId) {
  const json = await generateUserProfileJson(userId);
  if (!json) throw new Error(`No profile found for user ${userId}`);

  const text = convertUserJsonToText(json);
  const vector = await embedUserText(text);
  const result = await storeUserVector(userId, text, vector);

  console.log(`✅ Stored vector for user ${userId}`);
  return result;
}

module.exports = processUserPipeline;

const { createClient } = require('redis');
const { REDIS_HOST, REDIS_PORT } = process.env;

const redisClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    // legacyMode: true,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('ready', () => console.log('Redis Client Ready'));
redisClient.on('end', () => console.log('Redis Client Disconnected'));

(async () => {
    await redisClient.connect().catch(console.error);
});

module.exports = redisClient;
import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL;
let localRedisInstance: RedisClientType | undefined = undefined;

if (redisUrl) {
  // console.log(`REDIS_URL is set. Initializing Redis client for ${redisUrl}...`);
  localRedisInstance = createClient({
    url: redisUrl,
    // Example: add other configurations if needed
    // socket: {
    //   connectTimeout: 5000,
    //   reconnectStrategy: retries => Math.min(retries * 50, 500) // Example reconnect strategy
    // }
  });

  localRedisInstance.on("connect", () => {
    // This event is for successful connection
    // console.log(`Successfully connected to Redis server at ${redisUrl}`);
  });

  localRedisInstance.on("error", (err: Error) => {
    // This handles errors that occur after an initial connection,
    // or if connect() fails and its error is not caught to terminate the app.
    // For critical startup errors, connectAndInitializeRedis will throw.
    console.error("Redis Client Background Error:", err);
  });
} else {
  // console.log('REDIS_URL is not set. Redis will not be actively used by MyInvoisClient.');
}

/**
 * Attempts to connect to Redis if REDIS_URL is set.
 * If REDIS_URL is set and connection fails, this function will throw an error.
 * If REDIS_URL is not set, it does nothing and returns null.
 * @returns A promise that resolves with the connected RedisClientType instance or null.
 * @throws Error if REDIS_URL is set and the connection to Redis fails.
 */
export async function connectAndInitializeRedis(): Promise<RedisClientType | null> {
  if (localRedisInstance && redisUrl) {
    // Only attempt to connect if a client was created (i.e., REDIS_URL was set)
    try {
      // console.log(`Attempting to connect to Redis at ${redisUrl}...`);
      await localRedisInstance.connect();
      // console.log('Redis connection successfully established.');
      return localRedisInstance;
    } catch (err) {
      // console.error(`CRITICAL: Could not connect to Redis at ${redisUrl}. See error below. Application startup will be halted.`);
      // console.error(err); // Log the specific Redis error
      throw new Error(
        `Redis connection failed for URL ${redisUrl}. Original error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  return null; // Return null if REDIS_URL was not set (so localRedisInstance is null)
}

/**
 * The Redis client instance.
 * It will be null if REDIS_URL is not set.
 * If REDIS_URL is set, this will be the client instance;
 * `connectAndInitializeRedis()` must be called to establish its connection.
 * This instance is passed to MyInvoisClient.
 */
export const redisInstance = localRedisInstance;

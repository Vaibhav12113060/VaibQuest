import { redis } from "../config/redis.js";

// Add cache key to a Redis Set (used for grouped invalidation)

const isDev = process.env.NODE_ENV === "development";
console.log(isDev ? "is in dev mode" : "is in production");

const addKeyToSet = async (setName, key) => {
  if (!setName) return;

  try {
    await redis.sadd(setName, key);
  } catch (error) {
    console.error(`Redis SADD error for set ${setName}:`, error);
  }
};

const cacheMiddleware = async (req, res, next) => {
  // Build cache key
  let key = req.baseUrl + req.path;

  const queryString = new URLSearchParams(req.query).toString();

  if (queryString) {
    key += `?${queryString}`;
  }

  // User-specific cache
  if (req.user) {
    key += `:${req.user._id.toString()}`;
  }

  try {
    // Check Redis
    const cachedData = await redis.get(key);

    if (cachedData) {
      if (isDev) {
        console.log(`✅ Cache HIT -> ${key}`);
      }
      return res.status(200).json(JSON.parse(cachedData));
    }

    if (isDev) {
      console.log(`❌ Cache MISS -> ${key}`);
    }

    const originalJson = res.json;

    // Read cache set once
    const cacheSetName = res.locals.cacheSet;

    res.json = async (body) => {
      try {
        // Store response in Redis
        await redis.set(key, JSON.stringify(body), "EX", 3600);

        // Add key to cache group
        if (cacheSetName) {
          await addKeyToSet(cacheSetName, key);
        }
        if (isDev) {
          console.log(`💾 Cached -> ${key}`);
        }
      } catch (err) {
        console.error("Redis SET Error:", err);
      }

      return originalJson.call(res, body);
    };

    next();
  } catch (error) {
    console.error("Redis Cache Error:", error);
    next();
  }
};

export default cacheMiddleware;

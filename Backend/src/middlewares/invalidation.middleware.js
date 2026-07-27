import { redis } from "../config/redis.js";

export const invalidateCache = (options) => {
  return async (req, res, next) => {
    try {
      let setsToInvalidate = [];
      if (options.set) {
        setsToInvalidate.push(
          typeof options.set === "function" ? options.set(req) : options.set,
        );
      }
      if (options.sets) {
        setsToInvalidate.push(
          ...(typeof options.sets === "function"
            ? options.sets(req)
            : options.sets),
        );
      }

      for (const setName of setsToInvalidate) {
        if (setName) {
          const keys = await redis.smembers(setName);
          if (keys.length > 0) {
            await redis.del(keys);
            await redis.del(setName); // Clear the set itself
          }
        }
      }

      let keysToInvalidate = [];
      if (options.keys) {
        keysToInvalidate.push(
          ...(typeof options.keys === "function"
            ? options.keys(req)
            : options.keys),
        );
      }
      if (keysToInvalidate.length > 0) {
        await redis.del(keysToInvalidate);
      }
    } catch (error) {
      console.error("Redis cache invalidation error:", error);
    }
    next();
  };
};

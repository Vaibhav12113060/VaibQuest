import Redis from "ioredis";

const isDev = process.env.NODE_ENV === "development";

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,
  lazyConnect: false,
});

if (isDev) {
  redis.on("connect", () => console.log("Redis Connected"));

  redis.on("ready", () => console.log("Redis Ready"));
}

redis.on("error", (err) => console.log(err));

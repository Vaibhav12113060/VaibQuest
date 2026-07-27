// import { redis } from "../config/redis.js";

// const WINDOW = Number(process.env.RATE_LIMIT_WINDOW) || 60;
// const MAX = Number(process.env.RATE_LIMIT_MAX) || 5;

// // const rateLimiter = async (req, res, next) => {
// //   try {
// //     const identifier =
// //       req.user?._id?.toString() ||
// //       req.headers["x-forwarded-for"]?.split(",")[0] ||
// //       req.ip;

// //     const key = `rate_limit:${identifier}`;

// //     const requests = await redis.incr(key);

// //     if (requests === 1) {
// //       await redis.expire(key, WINDOW);
// //     }

// //     if (requests > MAX) {
// //       const retryAfter = await redis.ttl(key);

// //       return res.status(429).json({
// //         success: false,
// //         message: "Too Many Requests",
// //         retryAfter,
// //       });
// //     }

// //     next();
// //   } catch (err) {
// //     console.error("Rate Limit Error:", err);

// //     next();
// //   }
// // };

// // export default rateLimiter;

// const rateLimiter = async (req, res, next) => {
//   try {
//     console.log("RATE LIMIT MIDDLEWARE");
//     console.log("IP:", req.ip);
//     console.log("Forwarded:", req.headers["x-forwarded-for"]);

//     const identifier =
//       req.user?._id?.toString() ||
//       req.headers["x-forwarded-for"]?.split(",")[0] ||
//       req.ip;

//     console.log("Identifier:", identifier);

//     const key = `rate_limit:${identifier}`;

//     const requests = await redis.incr(key);

//     console.log("Requests:", requests);

//     if (requests === 1) {
//       await redis.expire(key, WINDOW);
//     }

//     if (requests > MAX) {
//       console.log("BLOCKED");
//       return res.status(429).json({
//         success: false,
//         message: "Too Many Requests",
//       });
//     }

//     next();
//   } catch (err) {
//     console.error(err);
//     next();
//   }
// };

// export default rateLimiter;

import { redis } from "../config/redis.js";

const WINDOW = Number(process.env.RATE_LIMIT_WINDOW) || 60;
const MAX = Number(process.env.RATE_LIMIT_MAX) || 5;

const isDev = process.env.NODE_ENV === "development";

const rateLimiter = async (req, res, next) => {
  if (isDev) {
    console.log("\n========== RATE LIMIT ==========");
  }

  try {
    const identifier =
      req.user?._id?.toString() ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip;

    const key = `rate_limit:${identifier}`;

    if (isDev) {
      console.log("Identifier:", identifier);
      console.log("Redis Key :", key);
    }

    const requests = await redis.incr(key);

    if (isDev) {
      console.log("Current Count:", requests);
    }

    if (requests === 1) {
      await redis.expire(key, WINDOW);
      if (isDev) {
        console.log(`Expiry set to ${WINDOW} seconds`);
      }
    }

    const ttl = await redis.ttl(key);

    if (isDev) {
      console.log("TTL:", ttl);
    }

    if (requests > MAX) {
      if (isDev) {
        console.log("❌ RATE LIMITED");
      }

      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
        retryAfter: ttl,
      });
    }

    if (isDev) {
      console.log("✅ Request Allowed");
      console.log("===============================\n");
    }

    next();
  } catch (err) {
    console.error("Rate Limiter Error:", err);
    next();
  }
};

export default rateLimiter;

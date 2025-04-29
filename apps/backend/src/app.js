import express from "express";
import cors from "cors";
import Redis from "ioredis";

import apiRoutes from "./routes/index.js";

const redis = new Redis();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);
// Example of caching data
app.get("/cache", async (req, res) => {
    const cachedData = await redis.get("cachedData");

    if (cachedData) {
        // If data exists in the cache, return it
        res.send(JSON.parse(cachedData));
    } else {
        // If data is not in the cache, fetch it from the source
        const dataToCache = { message: "Data to be cached" };
        await redis.set("cachedData", JSON.stringify(dataToCache), "EX", 3600); // Cache for 1 hour
        res.send(dataToCache);
    }
});

export default app;

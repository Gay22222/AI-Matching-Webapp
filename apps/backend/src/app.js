import express from "express";
import cors from "cors";
import Redis from "ioredis";

import apiRoutes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redis = new Redis();

const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", apiRoutes);

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

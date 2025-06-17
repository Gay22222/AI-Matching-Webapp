import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Type'],
}));
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Log tất cả request
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`, {
        headers: req.headers,
        query: req.query,
        body: req.body,
    });
    next();
});

// Static files
const uploadsPath = path.join(__dirname, "../uploads");
console.log(`Serving static files from: ${uploadsPath}`);
app.use("/uploads", express.static(uploadsPath, {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Cache-Control', 'public, max-age=31557600'); // Cache 1 năm
    }
}));

// Routes
app.use('/api', apiRoutes);

// Xử lý lỗi 404
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        statusCode: 404,
        message: `Cannot ${req.method} ${req.url}`,
    });
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
    console.error("Server error:", {
        message: err.message,
        stack: err.stack,
        url: req.url,
    });
    res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
    });
});

export default app;
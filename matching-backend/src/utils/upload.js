import multer from "multer";
import path from "path";
import fs from "fs";
import logger from "../utils/logger.js"; // Giả định bạn có logger

// Hàm tạo thư mục nếu chưa tồn tại
const ensureDirSync = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user?.id;
        if (!userId) {
            logger.error("User ID is missing", { user: req.user, headers: req.headers });
            return cb(new Error("User ID is missing"), null);
        }
        const uploadPath = path.join("uploads", userId.toString(), "images");
        ensureDirSync(uploadPath);
        logger.info(`Uploading file to: ${uploadPath}`);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `image-${uniqueSuffix}${ext}`);
    },
});

// Bộ lọc file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        logger.warn(`Invalid file type: ${file.mimetype}`);
        cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
        files: 6, // Giới hạn 6 file
    },
});

export default upload;
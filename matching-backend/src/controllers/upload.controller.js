import prisma from "../prisma/client.js";
import path from "path";
import logger from "../utils/logger.js";
import fs from "fs";

export const uploadController = {
    uploadSingle: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Không có file nào được upload" });
            }
            const { bioId, isProfilePic } = req.body;
            const userId = req.user.id;
            const fileUrl = `/Uploads/${userId}/images/${req.file.filename}`;

            // Kiểm tra số lượng ảnh hiện có
            const currentPhotos = await prisma.photo.count({
                where: { bio_id: parseInt(bioId) },
            });
            if (currentPhotos >= 6) {
                return res.status(400).json({ message: "Đã đạt tối đa 6 ảnh" });
            }

            // Nếu là ảnh đại diện, đặt is_profile_pic: true và cập nhật ảnh cũ
            if (isProfilePic === "true") {
                // Bỏ chọn ảnh đại diện cũ
                await prisma.photo.updateMany({
                    where: { bio_id: parseInt(bioId), is_profile_pic: true },
                    data: { is_profile_pic: false },
                });
            }

            const photo = await prisma.photo.create({
                data: {
                    bio_id: parseInt(bioId),
                    url: fileUrl,
                    is_profile_pic: isProfilePic === "true",
                },
            });

            res.status(201).json({
                message: "Upload thành công",
                photo: {
                    id: photo.id,
                    url: photo.url,
                    is_profile_pic: photo.is_profile_pic,
                },
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({
                message: "Lỗi server khi upload ảnh",
                error: error.message,
            });
        }
    },

    uploadMultiple: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "Không có file nào được upload" });
            }
            const { bioId } = req.body;
            const userId = req.user.id;

            // Kiểm tra số lượng ảnh hiện có
            const currentPhotos = await prisma.photo.count({
                where: { bio_id: parseInt(bioId) },
            });
            const newPhotosCount = req.files.length;
            if (currentPhotos + newPhotosCount > 6) {
                return res.status(400).json({ message: `Chỉ được upload tối đa ${6 - currentPhotos} ảnh nữa` });
            }

            const photos = await Promise.all(
                req.files.map(async (file) => {
                    const fileUrl = `/Uploads/${userId}/images/${file.filename}`;
                    const photo = await prisma.photo.create({
                        data: {
                            bio_id: parseInt(bioId),
                            url: fileUrl,
                            is_profile_pic: false,
                        },
                    });
                    return {
                        id: photo.id,
                        url: photo.url,
                        is_profile_pic: photo.is_profile_pic,
                    };
                })
            );

            res.status(201).json({
                message: "Upload nhiều ảnh thành công",
                count: req.files.length,
                photos,
            });
        } catch (error) {
            console.error("Upload multiple error:", error);
            res.status(500).json({
                message: "Lỗi server khi upload nhiều ảnh",
                error: error.message,
            });
        }
    },

    deletePhoto: async (req, res) => {
        try {
            const { photoId } = req.params;
            const userId = req.user.id;

            // Tìm ảnh trong database
            const photo = await prisma.photo.findUnique({
                where: { id: parseInt(photoId) },
                include: { Bio: { select: { user_id: true } } },
            });

            if (!photo) {
                return res.status(404).json({ statusCode: 404, message: "Ảnh không tồn tại" });
            }

            // Kiểm tra quyền sở hữu
            if (photo.Bio.user_id !== userId) {
                return res.status(403).json({ statusCode: 403, message: "Không có quyền xóa ảnh này" });
            }

            // Xóa file vật lý nếu tồn tại
            const filePath = path.join("Uploads", userId.toString(), "images", path.basename(photo.url));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                logger.info(`Deleted file: ${filePath}`);
            }

            // Xóa bản ghi trong database
            await prisma.photo.delete({
                where: { id: parseInt(photoId) },
            });

            res.status(200).json({
                statusCode: 200,
                message: "Xóa ảnh thành công",
            });
        } catch (error) {
            logger.error({ error, stack: error.stack }, "Error deleting photo");
            res.status(500).json({
                statusCode: 500,
                message: "Lỗi server khi xóa ảnh",
                error: error.message,
            });
        }
    },
};
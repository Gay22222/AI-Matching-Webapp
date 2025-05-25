import prisma from "../prisma/client.js";

export const uploadController = {
    uploadSingle: async (req, res) => {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Không có file nào được upload" });
            }

            const { bioId } = req.body;
            const fileUrl = `/uploads/${req.file.filename}`;

            const photo = await prisma.photo.create({
                data: {
                    bio_id: parseInt(bioId),
                    url: fileUrl,
                    is_profile_pic: req.body.isProfilePic === "true",
                },
            });

            res.status(201).json({
                message: "Upload thành công",
                photo,
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
                return res
                    .status(400)
                    .json({ message: "Không có file nào được upload" });
            }

            const { bioId } = req.body;

            // Tạo mảng dữ liệu để insert
            const photosData = req.files.map((file, index) => ({
                bio_id: parseInt(bioId),
                url: `/uploads/${file.filename}`,
                is_profile_pic: index === 0, // Ảnh đầu tiên là ảnh đại diện
            }));

            // Lưu thông tin các ảnh vào database
            const photos = await prisma.photo.createMany({
                data: photosData,
            });

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
};

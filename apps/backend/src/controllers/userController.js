import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Lấy thông tin từ bảng bio theo user_id
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await prisma.bio.findUnique({
            where: { user_id: parseInt(userId) },
            include: {
                Photo: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }
        const photos = profile.Photo.map((photo) => ({
            id: photo.id,
            photo_url: `${req.protocol}://${req.get('host')}${photo.photo_url}`,
            is_profile_pic: photo.is_profile_pic,
            uploaded_at: photo.uploaded_at
        } ));
        res.json({
            bio_id: profile.bio_id,
            user_id: profile.user_id,
            name: profile.name,
            age: profile.age,
            about_me: profile.about_me,
            photos // Trả về danh sách ảnh
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const uploadPhoto = async (req, res) => {
    try {
        const { bioId } = req.params;

        // Kiểm tra hồ sơ tồn tại không
        const bio = await prisma.bio.findUnique({
            where: { bio_id: parseInt(bioId) }
        });

        if (!bio) {
            return res.status(404).json({ error: 'Bio not found' });
        }

        // Kiểm tra nếu không có file ảnh
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const photoUrl = `/uploads/${req.file.filename}`;

        // Lưu vào bảng Photo
        const newPhoto = await prisma.photo.create({
            data: {
                bio_id: bio.bio_id,
                photo_url: photoUrl,
                is_profile_pic: req.body.is_profile_pic === 'true' // Nếu gửi true thì đánh dấu là ảnh đại diện
            }
        });

        return res.json({ message: 'Photo uploaded successfully', photo: newPhoto });
    } catch (error) {
        console.error('Error uploading photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
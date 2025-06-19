# AI Matching Webapp

Dự án bao gồm hai thành phần chính:

- **frontend/**: Ứng dụng web xây dựng bằng Next.js.
- **matching-backend/**: API và các dịch vụ hỗ trợ viết bằng Node.js.

Mỗi thư mục đều có hướng dẫn chi tiết về cài đặt và sử dụng:

- [`frontend/README.md`](frontend/README.md)
- [`matching-backend/readme.md`](matching-backend/readme.md)

## Yêu cầu chung

- Node.js >= 20
- pnpm >= 10
- (Tùy chọn) Docker và Docker Compose để chạy bằng container.

## Cách cài đặt nhanh

1. Clone repository:
   ```bash
   git clone https://github.com/Gay22222/AI-Matching-Webapp.git
   cd AI-Matching-Webapp
   ```
2. Cài đặt dependencies cho từng phần:
   ```bash
   cd frontend && pnpm install
   cd ../matching-backend && pnpm install
   ```
3. Làm theo hướng dẫn cụ thể trong README của từng thư mục để khởi chạy frontend và backend.

## Cấu trúc thư mục

```
AI-Matching-Webapp/
├── frontend/          # Next.js client
├── matching-backend/  # Express/Prisma server
└── README.md          # Tài liệu tổng quan (file hiện tại)
```

Để biết thêm chi tiết cấu hình, chạy production hay Docker, vui lòng xem các README ở từng thư mục trên.



# Phân Chia Công Việc Dự Án DateViet

Dưới đây là phân chia công việc ngắn gọn cho 4 thành viên dự án DateViet:

| **Mã SV**   | **Tên**                    | **Nhiệm vụ**                                                                 | **Tỷ lệ** |
|-------------|----------------------------|------------------------------------------------------------------------------|-----------|
| 21522516    | Nguyễn Việt Quang         | AI (embedding, Weaviate, cron job), merge code, fix bug, thiết lập Docker     | 38%       |
| 22520637    | Lê Mai Quốc Khánh         | Thông báo (API, Socket.IO), trò chuyện (API, Icebreakers), logic ghép đôi     | 25%       |
| 22520928    | Nguyễn Thị Kiều Nga       | Viết tài liệu, làm slide, hỗ trợ thiết kế giao diện, logic giao diện          | 17%       |
| 23520850    | Phùng Việt Linh           | Đăng ký/đăng nhập, thiết lập hồ sơ, quản lý ảnh, thiết kế giao diện          | 20%       |


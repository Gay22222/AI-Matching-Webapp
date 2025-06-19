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

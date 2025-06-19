# Hướng Dẫn Thiết Lập Frontend DateViet

Hướng dẫn này cung cấp các bước để thiết lập và chạy frontend DateViet (dùng **Next.js**, **React**, **TypeScript**, **Tailwind CSS**) theo hai cách: **Local** và **Docker**. Frontend gọi API backend tại `http://localhost:3001`.

## Yêu cầu

- **Node.js**: Phiên bản 20.19.0 trở lên (cho local).
- **pnpm**: Phiên bản 10.6.3.
- **Docker**: Phiên bản mới nhất với Docker Compose (cho Docker).
- **Backend**: Các dịch vụ backend (`backend`, `embedding`, `mysql`, `redis`, `weaviate`) phải chạy trong mạng `matching-backend_matchmaking-network`.

## Thiết Lập

### Cách 1: Chạy Local

1. **Clone dự án**:
   ```bash
   git clone https://github.com/Gay22222/AI-Matching-Webapp.git
   cd frontend
   ```

2. **Cài đặt Node.js**:
   ```bash
   node -v
   ```
   Đảm bảo phiên bản là **20.19.0** hoặc cao hơn.

3. **Cài đặt pnpm**:
   ```bash
   npm install -g pnpm@10.6.3
   pnpm -v
   ```
   Kết quả: `10.6.3`.

4. **Cài đặt dependencies**:
   ```bash
   pnpm install
   ```

5. **Xóa cache nếu cần**:
   ```bash
   pnpm cache clear
   pnpm install
   ```

6. **Chạy ứng dụng**:
   ```bash
   pnpm run dev
   ```
   Truy cập: `http://localhost:3000`.

7. **Build cho production (tùy chọn)**:
   ```bash
   pnpm run build
   pnpm run start
   ```

### Cách 2: Chạy Docker

1. **Clone dự án**:
   ```bash
   git clone https://github.com/Gay22222/AI-Matching-Webapp.git
   cd frontend
   ```

2. **Khởi động backend**:
   ```bash
   cd ../backend
   docker-compose up -d
   docker ps
   ```

3. **Kiểm tra IP container backend**:
   ```bash
   docker inspect matching-backend-backend-1 | findstr IPAddress
   ```
   Cập nhật IP (ví dụ: `172.18.0.2`) vào `docker-compose.yml` (dòng `extra_hosts: localhost:<IP>`).

4. **Xóa image cũ (nếu cần)**:
   ```bash
   cd ../frontend
   docker rmi $(docker images -q frontend)
   ```

5. **Build và chạy lần đầu**:
   ```bash
   docker-compose up --build
   ```
   Truy cập: `http://localhost:3000`.

6. **Rebuild (nếu cần)**:
   ```bash
   docker-compose down
   docker rmi $(docker images -q frontend)
   docker-compose up --build
   ```

7. **Dừng ứng dụng**:
   ```bash
   docker-compose down
   ```

## Khắc phục sự cố

- **Backend không kết nối trong Docker**:
   ```bash
   docker inspect matching-backend-backend-1 | findstr IPAddress
   docker exec <frontend-container-id> curl http://localhost:3001
   ```

- **Xung đột cổng**:
   Sửa cổng trong `docker-compose.yml` hoặc chạy:
   ```bash
   pnpm run dev -- -p <cổng-mới>
   ```

- **Lỗi dependencies**:
   ```bash
   pnpm cache clear
   pnpm install
   ```
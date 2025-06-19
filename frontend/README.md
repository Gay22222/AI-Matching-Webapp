Hướng Dẫn Thiết Lập Frontend DateViet
Hướng dẫn này cung cấp các lệnh để thiết lập và chạy frontend DateViet (dùng Next.js, React, TypeScript, Tailwind CSS) theo hai cách: Local và Docker. Frontend gọi API backend tại http://localhost:3001.
Yêu cầu

Node.js: Phiên bản 20.19.0 trở lên (cho local).
pnpm: Phiên bản 10.6.3.
Docker: Phiên bản mới nhất với Docker Compose (cho Docker).
Backend: Các dịch vụ backend (backend, embedding, mysql, redis, weaviate) phải chạy trong mạng matching-backend_matchmaking-network.

Thiết Lập
Cách 1: Chạy Local

Clone dự án:
git clone [<repository-url>](https://github.com/Gay22222/AI-Matching-Webapp.git)
cd frontend


Cài đặt Node.js:
node -v

Đảm bảo phiên bản là 20.19.0 hoặc cao hơn.

Cài đặt pnpm:
npm install -g pnpm@10.6.3
pnpm -v

Kết quả: 10.6.3.

Cài đặt dependencies:
pnpm install

Xóa cache nếu cần:
pnpm cache clear
pnpm install


Khởi động backend:
cd ../backend
docker-compose up -d
docker ps


Chạy ứng dụng:
cd ../frontend
pnpm run dev

Truy cập: http://localhost:3000.

Build cho production (tùy chọn):
pnpm run build
pnpm run start



Cách 2: Chạy Docker

Clone dự án:
git clone <repository-url>
cd frontend


Khởi động backend:
cd ../backend
docker-compose up -d
docker ps


Kiểm tra IP container backend:
docker inspect matching-backend-backend-1 | findstr IPAddress

Cập nhật IP (ví dụ: 172.18.0.2) vào docker-compose.yml (dòng extra_hosts: localhost:<IP>).

Xóa image cũ (nếu cần):
cd ../frontend
docker rmi $(docker images -q frontend)


Build và chạy lần đầu:
docker-compose up --build

Truy cập: http://localhost:3000.

Rebuild (nếu cần):
docker-compose down
docker rmi $(docker images -q frontend)
docker-compose up --build


Dừng ứng dụng:
docker-compose down



Khắc phục sự cố

Backend không kết nối trong Docker:
docker inspect matching-backend-backend-1 | findstr IPAddress
docker exec <frontend-container-id> curl http://localhost:3001


Xung đột cổng:Sửa cổng trong docker-compose.yml hoặc chạy:
pnpm run dev -- -p <cổng-mới>


Lỗi dependencies:
pnpm cache clear
pnpm install




# AI Matching Webapp - Backend

Backend cho ứng dụng matchmaking, sử dụng Node.js, Prisma, MySQL, Redis, và Weaviate để cung cấp API, xử lý dữ liệu người dùng, và tìm kiếm tương thích dựa trên AI.

**GitHub Repository**: [https://github.com/Gay22222/AI-Matching-Webapp](https://github.com/Gay22222/AI-Matching-Webapp)

## Yêu cầu

- **Node.js**: v20.19.0 (khuyến nghị, khớp với Docker setup)
- **pnpm**: v10.6.3
- **Docker** và **Docker Compose** (cho setup với Docker)
- **MySQL**: 8.0 (chạy trên host hoặc Docker)
- **Redis**: 7.0 (chạy trên host hoặc Docker)
- **Weaviate**: latest (chạy trong Docker, port 8080)

## Cấu trúc thư mục

- `src/server.js`: API chính (chạy trên port 3001).
- `src/ai/embedServer.js`: Embedding server cho xử lý AI (port 8000).
- `src/prisma`: Schema, migrations, và seed dữ liệu cho MySQL.
- `src/ai`: Xử lý dữ liệu người dùng và nhúng vào Weaviate.
- `src/controllers`, `src/services`, `src/routes`: Logic nghiệp vụ và định tuyến API.
- `src/sockets`: Xử lý WebSocket cho tin nhắn và thông báo real-time.

## Cài đặt trên Host

### 1. Clone repository
```bash
git clone https://github.com/Gay22222/AI-Matching-Webapp.git
cd AI-Matching-Webapp

2. Cài đặt dependencies
pnpm install

3. Thiết lập biến môi trường
Tạo file .env trong thư mục gốc (matching-backend) với nội dung sau:
DATABASE_URL="mysql://root:match@123@localhost:3306/matchmaking_db"
WEAVIATE_HOST="localhost:8080"
JWT_SECRET="1234567890abcdefg"
REDIS_HOST="localhost"
REDIS_PORT=6379
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
PORT=3001
EMBEDDING_HOST="localhost"
EMBEDDING_PORT=8000
LOG_LEVEL="debug"
FRONTEND_URL="http://localhost:3000"

Lấy App Password cho Gmail

Truy cập https://myaccount.google.com/security.
Bật 2-Step Verification (Xác minh 2 bước) nếu chưa bật.
Tìm mục App passwords (Mật khẩu ứng dụng - nằm trong phần xác minh 2 bước): 
Chọn App > Mail, Device > Other (Custom name), đặt tên (ví dụ: Matching Backend).
Nhấn Generate để lấy mã 16 ký tự (ví dụ: ifpz fypy becd dyma).


Copy mã này vào EMAIL_PASS trong .env.

Lưu ý: Không sử dụng mật khẩu Gmail thông thường, chỉ App Password hoạt động với SMTP.
4. Thiết lập database MySQL

Đảm bảo MySQL chạy trên localhost:3306.
Tạo database matchmaking_db:CREATE DATABASE matchmaking_db;


Migrate schema:pnpm exec prisma migrate dev --schema=src/prisma/schema.prisma --name init


Generate Prisma client:pnpm exec prisma generate



5. Seed dữ liệu mẫu
Chạy lệnh để seed dữ liệu người dùng mẫu:
pnpm exec prisma db seed

Dữ liệu mẫu được định nghĩa trong src/prisma/seeds/index.js.
6. Chạy Weaviate
Nếu chưa chạy Weaviate, khởi động container:
docker run -d --name weaviate -p 8080:8080 semitechnologies/weaviate:latest --host 0.0.0.0 --port 8080 --scheme http

7. Chạy backend

Development (sử dụng nodemon):pnpm run dev


Production:pnpm start



8. Truy cập

API: http://localhost:3001/api
Embedding server: http://localhost:8000/embed
Weaviate: http://localhost:8080





Cài đặt với Docker
1. Clone repository
git clone https://github.com/Gay22222/AI-Matching-Webapp.git
cd AI-Matching-Webapp

2. Tạo file .env
Sao chép nội dung sau vào .env:
DATABASE_URL="mysql://root:match@123@mysql:3306/matchmaking_db"
WEAVIATE_HOST="weaviate:8080"
JWT_SECRET="1234567890abcdefg"
REDIS_HOST="redis"
REDIS_PORT=6379
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
PORT=3001
EMBEDDING_HOST="embedding"
EMBEDDING_PORT=8000
LOG_LEVEL="debug"
FRONTEND_URL="http://localhost:3000"

Lấy EMAIL_PASS theo hướng dẫn ở phần Lấy App Password cho Gmail phía trên.
3. Dừng Docker hiện tại
docker-compose down -v

4. Chạy Docker Compose
docker-compose up --build -d


Build và chạy các dịch vụ:
backend: API chính (port 3001).
embedding: Embedding server (port 8000).
mysql: MySQL (port 3306).
redis: Redis (port 6379).
weaviate: Weaviate (port 8080).


-d: Chạy ở chế độ background.

5. Migrate và seed database

Migrate schema:docker-compose exec backend npx prisma migrate dev --schema=src/prisma/schema.prisma --name init


Seed dữ liệu:docker-compose exec backend pnpm exec prisma db seed



6. Kiểm tra log
docker-compose logs backend
docker-compose logs embedding
docker-compose logs mysql
docker-compose logs redis
docker-compose logs weaviate

7. Truy cập

API: http://localhost:3001/api
Embedding server: http://localhost:8000/embed
Weaviate: http://localhost:8080

8. Dừng và xóa
docker-compose down -v


-v: Xóa volumes (dữ liệu MySQL, Redis, Weaviate).

Debug

Kiểm tra trạng thái dịch vụ:docker-compose ps


Xem log container:docker-compose logs <service>


Kiểm tra tài nguyên:docker stats


Reset database:docker-compose exec backend npx prisma migrate reset

Lưu ý: Backup dữ liệu trước khi reset.

Backup dữ liệu

MySQL:mysqldump -h localhost -u root -p matchmaking_db > backup.sql

Restore:mysql -h localhost -u root -p matchmaking_db < backup.sql


Weaviate:docker cp weaviate:/var/lib/weaviate ./weaviate-backup

Restore:docker cp ./weaviate-backup/. weaviate:/var/lib/weaviate



Production

Cấu hình:
Xóa volume đồng bộ mã nguồn (.:/app) trong docker-compose.yml.
Đặt NODE_ENV=production trong .env.
Sử dụng mật khẩu mạnh hơn cho MYSQL_ROOT_PASSWORD và JWT_SECRET.







FAQ

Lỗi "Cannot connect to MySQL"?
Kiểm tra MySQL đang chạy (mysql -h localhost -u root -p).
Đảm bảo DATABASE_URL đúng trong .env.


Lỗi "Weaviate not available"?
Kiểm tra container Weaviate (docker ps).
Đảm bảo WEAVIATE_HOST đúng (weaviate:8080 trong Docker, localhost:8080 trên host).




Tăng CPU/memory cho container embedding.





`

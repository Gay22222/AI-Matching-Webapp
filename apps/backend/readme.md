# AI Matching Webapp - Backend

## Yêu cầu

- Node.js (>=18)
- pnpm (>=8)
- MySQL (đang dùng localhost)

## Cấu trúc thư mục

Dự án sử dụng kiến trúc monorepo với `pnpm workspaces`.

Backend đặt tại:apps/backend

## Cài đặt

Truy cập vào thư mục backend:
cd apps/backend

Cài dependencies:

pnpm install


## Thiết lập kết nối database

Hiện tại biến môi trường `DATABASE_URL` đang được cấu hình thông qua biến môi trường của hệ điều hành, không sử dụng `.env`.

Dùng lệnh sau trong PowerShell để cấu hình:

$env:DATABASE_URL="mysql://username:password@localhost:3306/matching_db"
trong mysql
username (ví dụ root)
password(tạo lúc cài mysql)
matching_db là db sẽ được tạo


Lưu ý: Lệnh trên **phải được chạy trong terminal PowerShell** trước khi thực hiện các lệnh Prisma.

## Prisma

### Khởi tạo database & migrate schema

Chạy lệnh sau trong thư mục `apps/backend`:

pnpm exec prisma migrate dev --schema=src/prisma/schema.prisma --name init


Hoặc nếu đã migrate, có thể chạy:

pnpm exec prisma generate


### Seed dữ liệu mẫu (nếu có)

Sau khi đã có schema:

pnpm exec prisma db seed
ở đây tôi có tạo 1 file seed dữ liệu user mẫus trong /src/prisma






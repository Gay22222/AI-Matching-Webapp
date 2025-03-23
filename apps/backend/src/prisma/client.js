/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/

/**
 * Thiết lập và xuất Prisma Client
 *
 * @description
 * - File này chịu trách nhiệm khởi tạo và cấu hình Prisma Client để kết nối với cơ sở dữ liệu.
 * - Sử dụng thư viện `dotenv` để tải các biến môi trường từ file `.env`, đảm bảo thông tin kết nối cơ sở dữ liệu được bảo mật.
 * - Prisma Client được khởi tạo một lần và được sử dụng trong toàn bộ ứng dụng backend.
 *
 * @dependencies
 * - `@prisma/client`: Thư viện Prisma Client để tương tác với cơ sở dữ liệu.
 * - `dotenv`: Thư viện để tải các biến môi trường từ file `.env`.
 * - `path`: Thư viện Node.js để xử lý đường dẫn file.
 *
 * @exports
 * - `prisma`: Một instance của Prisma Client, được sử dụng để thực hiện các truy vấn cơ sở dữ liệu.
 */



import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Load biến môi trường từ backend/src/config/.env
dotenv.config({ path: path.resolve("src/config/.env") });

const prisma = new PrismaClient();
export default prisma;

/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function convertUserJsonToText(json) {
  const text = `
Tôi là ${json.display_name}, ${json.age} tuổi.
Tôi đang tìm kiếm ${json.searching_for}, thuộc cung hoàng đạo ${json.zodiac}.
Tôi ${json.drink ? 'có' : 'không'} uống rượu, ${json.smoke ? 'có' : 'không'} hút thuốc, và ${json.train ? 'có' : 'không'} tập thể thao.
Tôi thích: ${json.favorite_list.join(', ')}.
Tính cách: ${json.character_list.join(', ')}.
Phong cách giao tiếp: ${json.communicate_style_list.join(', ')}.
Ngôn ngữ yêu thương: ${json.love_language_list.join(', ')}.
Thú cưng yêu thích: ${json.pet_list.join(', ')}.
Chế độ ăn uống: ${json.diet}, giấc ngủ: ${json.sleep}, phong cách dùng mạng xã hội: ${json.snu}.
Kỳ vọng tương lai về gia đình: ${json.future_family}.
Giới thiệu thêm: ${json.about_me}
`.trim();

  const dir = path.join(__dirname, '../user_data/text'); // Thay đổi đường dẫn
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
  const filePath = path.join(dir, `user_${json.id}.txt`);
  fs.writeFileSync(filePath, text, 'utf-8');

  return text;
}

export default convertUserJsonToText;
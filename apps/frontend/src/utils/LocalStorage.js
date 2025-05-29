// LocalStorage.js
// 🔒 Session hiện lưu bằng Cookie HTTP-only. Truy cập localStorage không còn được sử dụng.

const getData = (key) => {
    throw new Error(`getData("${key}") không còn hỗ trợ. Dữ liệu session hiện được quản lý qua cookie.`);
};

const setData = (key, value) => {
    throw new Error(`setData("${key}", ...) không còn hỗ trợ. Dữ liệu session hiện được quản lý qua cookie.`);
};

export { getData, setData };

const getData = (key) => {
    // Kiểm tra xem localStorage có tồn tại không
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error("Read from local storage:", error);
        }
    }
    return null; // Trả về null nếu localStorage không khả dụng
};

const setData = (key, value) => {
    // Kiểm tra xem localStorage có tồn tại không
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Save to local storage:", error);
        }
    }
};

export { getData, setData };
export const generateOTP = (length = 6) => {
    let otp = "";
    for (let index = 0; index < length; index++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

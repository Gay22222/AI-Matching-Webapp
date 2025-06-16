import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const emailService = {
    sendVerificationOtp: async (toEmail, otp) => {
        const mailOptions = {
            from: `${process.env.EMAIL_FROM}`,
            to: toEmail,
            subject: "Mã Xác Thực Email Của Bạn",
            text: `Mã xác thực của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`,
            html: `<p>Mã xác thực của bạn là: <strong>${otp}</strong>. Mã này sẽ hết hạn sau 5 phút.</p>`,
        };

        console.log(mailOptions);

        try {
            console.log(transporter);

            let info = await transporter.sendMail(mailOptions);
            console.log(
                `Verification OTP sent to ${toEmail}: %s`,
                info.messageId
            );
            return info;
        } catch (error) {
            console.error(`Error sending OTP to ${toEmail}:`, error);
            throw new Error("Gửi email xác thực thất bại.");
        }
    },
};

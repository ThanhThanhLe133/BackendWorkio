import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/candidate/auth/verified?token=${token}`;

    const mailOptions = {
        from: `"Workio Confirmation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirm your signup to continue',
        html: `
            <h2>Confirm your signup in Workio</h2>
            <p>Click the link below to verify your email (valid for 1 day):</p>
            <a href="${verifyUrl}">Verify your account</a>
        `,
    };

    await transporter.sendMail(mailOptions);
};
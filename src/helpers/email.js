import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, token, role) => {
    var verifyUrl = '';
    if (role === 'Candidate') {
        verifyUrl = `${process.env.CLIENT_URL}/candidate/auth/verified?token=${token}`;
    }
    else if (role === 'Recruiter') {
        verifyUrl = `${process.env.CLIENT_URL}/recruiter/auth/verified?token=${token}`;
    }
    else if (role === 'Center') {
        verifyUrl = `${process.env.CLIENT_URL}/center/auth/verified?token=${token}`;
    } else {
        verifyUrl = `${process.env.CLIENT_URL}/admin/auth/verified?token=${token}`;
    }

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

export const sendResetPasswordEmail = async (email, token, role) => {
    var verifyUrl = '';
    if (role === 'Candidate') {
        verifyUrl = `${process.env.CLIENT_URL}/candidate/auth/reset-password?token=${token}`;
    }
    else if (role === 'Recruiter') {
        verifyUrl = `${process.env.CLIENT_URL}/recruiter/auth/reset-password?token=${token}`;
    }
    else if (role === 'Center') {
        verifyUrl = `${process.env.CLIENT_URL}/center/auth/reset-password?token=${token}`;
    } else {
        verifyUrl = `${process.env.CLIENT_URL}/admin/auth/reset-password?token=${token}`;
    }

    const mailOptions = {
        from: `"Workio Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your Workio password',
        html: `
        <h2>Reset your Workio password</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Workio của mình.</p>
        <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu (có hiệu lực trong 1 ngày):</p>
        <a href="${verifyUrl}">Đặt lại mật khẩu</a>

        <br/><br/>
        <p>Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email này.</p>
        <p>Trân trọng,<br/>Đội ngũ Workio</p>
    `,
    };


    await transporter.sendMail(mailOptions);
};

export const sendInterviewEmail = async (email, job_post, data) => {
    const mailOptions = {
        from: `"Workio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Invitation to Interview',
        html: `
            <h2>You are invited to an interview</h2>
            <p>Dear ${data.candidateName || 'Candidate'},</p>
            <p>Please join your interview at the scheduled time:</p>
            <ul>
                <li><strong>Date & Time:</strong> ${data.scheduled_time || 'TBD'}</li>
                <li><strong>Position:</strong> ${job_post.position || 'TBD'}</li>
                <li><strong>Job Post Requirements:</strong> ${job_post.requirements || 'TBD'}</li>
                <li><strong>Location:</strong> ${data.location || 'Online / TBD'}</li>
                <li><strong>Interview Type:</strong> ${data.interview_type || 'TBD'}</li>
                <li><strong>Notes:</strong> ${data.notes || 'No notes provided'}</li>
            </ul>
            <p>Please make sure to be on time and prepared for the interview.</p>
            <p>Best regards,<br/>Workio Team</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

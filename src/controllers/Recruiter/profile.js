import * as services from '../../service/index.js';
import { getRecruiterId } from '../../helpers/check_user.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trỏ về thư mục public/uploads
const UPLOAD_DIR = path.join(__dirname, '../../../src/public/uploads');

// Hàm lưu ảnh Base64
const saveBase64Image = (base64String, userId) => {
    // 1. Validate Base64
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return base64String; // Nếu là URL cũ thì giữ nguyên
    }

    // 2. Lưu file
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const extension = matches[1].split('/')[1];
    const fileName = `avatar_recruiter_${userId}_${Date.now()}.${extension}`;

    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(UPLOAD_DIR, fileName), imageBuffer);

    // 3. Tạo URL (Lưu ý PORT phải khớp với server đang chạy)
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
    return `${SERVER_URL}/uploads/${fileName}`;
};

export const updateRecruiterProfile = async (req, res) => {
    try {
        const { id } = req.user; // id của User (bảng Users)
        let payload = req.body;

        if (!id) return res.status(400).json({ err: 1, msg: 'Missing ID' });

        // [FIX LỖI] Xử lý ảnh trước khi gọi Service
        if (payload.avatar_url && payload.avatar_url.startsWith('data:image')) {
            payload.avatar_url = saveBase64Image(payload.avatar_url, id);
        }

        // Gọi service cập nhật
        const response = await services.updateRecruiterProfile(id, payload);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            msg: 'Error: ' + error
        });
    }
};

export const getRecruiterProfile = async (req, res) => {
    try {
        // Lấy recruiter_id từ bảng Recruiters dựa trên user_id
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;
        
        const response = await services.getRecruiterProfile(recruiter_id);
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            mes: 'An error occurred, please try again later'
        });
    }
};
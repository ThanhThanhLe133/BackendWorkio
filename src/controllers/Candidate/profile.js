import * as services from '../../service/index.js'
import { getCandidateId } from '../../helpers/check_user.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đảm bảo trỏ đúng vào thư mục src/public/uploads của dự án
const UPLOAD_DIR = path.join(__dirname, '../../../src/public/uploads'); 

const saveBase64Image = (base64String, userId) => {
    // 1. Kiểm tra base64 hợp lệ
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return base64String; 
    }

    // 2. Lưu file vật lý
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const extension = matches[1].split('/')[1]; 
    const fileName = `avatar_${userId}_${Date.now()}.${extension}`;
    
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(UPLOAD_DIR)){
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Ghi file vào ổ cứng
    fs.writeFileSync(path.join(UPLOAD_DIR, fileName), imageBuffer);
    
    // 3. [FIX LỖI] Đổi Port từ 5000 thành 3000 để khớp với terminal
    // Bạn nên check file .env xem PORT là bao nhiêu, nhưng hiện tại terminal báo 3000 thì ta để 3000.
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
    
    // Tạo đường dẫn URL: http://localhost:3000/uploads/ten_file.png
    const fullUrl = `${SERVER_URL}/uploads/${fileName}`;
    
    return fullUrl; 
};
export const updateCandidateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        let payload = req.body;

        if (!id) return res.status(400).json({ err: 1, msg: 'Missing ID' });

        // Xử lý ảnh
        if (payload.avatar_url && payload.avatar_url.startsWith('data:image')) {
            // Không cần truyền req nữa
            payload.avatar_url = saveBase64Image(payload.avatar_url, id);
        }

        const response = await services.updateCandidateProfile(id, payload);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: -1, msg: 'Error: ' + error });
    }
}

export const getCandidateProfile = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;
        const response = await services.getCandidateProfile(candidate_id);
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            mes: 'An error occurred, please try again later'
        });
    }
}

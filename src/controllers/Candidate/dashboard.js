import * as services from '../../service/index.js'
// Đảm bảo đường dẫn import helper đúng
import { getCandidateId } from '../../helpers/check_user.js'; 

export const getDashboardData = async (req, res) => {
    try {
        // --- SỬA ĐOẠN NÀY ---
        // 1. Lấy candidate_id từ helper (Helper này thường sẽ tìm candidate dựa trên req.user.id)
        const candidate_id = await getCandidateId(req, res);
        
        // 2. Nếu không tìm thấy candidate_id (Helper thường đã trả về lỗi 404/400 rồi, nhưng check lại cho chắc)
        if (!candidate_id) return; 

        // 3. Truyền đúng biến candidate_id vào service
        const response = await services.getDashboardStats(candidate_id);
        
        return res.status(200).json(response);
        // --------------------

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            msg: 'An error occurred: ' + error.message
        })
    }
}
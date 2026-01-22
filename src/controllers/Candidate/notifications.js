import { CandidateNotificationBuilder } from '../../builder/Candidate/notifications.js'; // Import Builder

export const getCandidateNotifications = async (req, res) => {
    try {
        // Lấy ID từ token của Candidate (đã qua middleware verifyToken)
        const candidateId = req.user.candidate_id || req.user.id; 
        
        if (!candidateId) {
            return res.status(401).json({
                err: 1,
                mes: 'Không tìm thấy thông tin ứng viên',
            });
        }

        const builder = new CandidateNotificationBuilder();
        const result = await builder
            .setCandidateId(candidateId)
            .getNotifications();

        return res.status(200).json(result);
    } catch (error) {
        console.error('❌ Error in getCandidateNotifications:', error);
        return res.status(500).json({
            err: 1,
            mes: error.message || 'Có lỗi xảy ra khi lấy thông báo',
        });
    }
};
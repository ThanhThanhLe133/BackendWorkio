import { RecruiterNotificationBuilder } from '../../builder/Recruiter/notifications.js';

export const getRecruiterNotifications = async (req, res) => {
    try {
        // Recruiter ID nằm trong req.user.recruiter_id (nếu middleware đã gán)
        // Hoặc lấy từ user.id nếu recruiter_id chính là user.id (theo model bạn gửi thì recruiter_id là PK và là FK trỏ tới User)
        const recruiterId = req.user.id; 
        
        if (!recruiterId) {
            return res.status(401).json({
                err: 1,
                mes: 'Không tìm thấy thông tin nhà tuyển dụng',
            });
        }

        const builder = new RecruiterNotificationBuilder();
        const result = await builder
            .setRecruiterId(recruiterId)
            .getNotifications();

        return res.status(200).json(result);
    } catch (error) {
        console.error('❌ Error in getRecruiterNotifications:', error);
        return res.status(500).json({
            err: 1,
            mes: error.message || 'Có lỗi xảy ra khi lấy thông báo',
        });
    }
};
import { CourseManagement } from '../../builder/Center/course-management.js';

export const getCenterNotifications = async (req, res) => {
    try {
        const centerId = req.user.id;
        if (!centerId) {
            return res.status(401).json({
                err: 1,
                mes: 'Không tìm thấy thông tin trung tâm',
            });
        }

        const builder = new CourseManagement();
        const result = await builder
            .setCenterId(centerId)
            .getNotifications();

        return res.status(200).json(result);
    } catch (error) {
        console.error('❌ Error in getCenterNotifications:', error);
        return res.status(500).json({
            err: 1,
            mes: error.message || 'Có lỗi xảy ra khi lấy thông báo',
        });
    }
};

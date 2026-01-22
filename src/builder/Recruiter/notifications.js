import db from '../../models/index.js';
import { Op } from 'sequelize';

export class RecruiterNotificationBuilder {
    constructor() {
        this.recruiterId = null;
    }

    setRecruiterId(id) {
        this.recruiterId = id;
        return this;
    }

    async getNotifications() {
        try {
            // Lấy các lịch phỏng vấn thuộc về các bài đăng của Recruiter này
            // Logic: Recruiter -> JobPost -> Interview
            const interviews = await db.Interview.findAll({
                where: {
                    status: 'Đang diễn ra' 
                },
                include: [
                    {
                        model: db.JobPost,
                        as: 'job_post',
                        where: { recruiter_id: this.recruiterId }, // Lọc theo Recruiter
                        attributes: ['id', 'position']
                    },
                    {
                        model: db.Candidate,
                        as: 'candidate',
                        attributes: ['full_name']
                    }
                ],
                order: [['scheduled_time', 'ASC']], // Sắp xếp lịch gần nhất lên đầu
                limit: 10
            });

            // Map dữ liệu thành format thông báo
            const notifications = interviews.map(item => {
                const candidateName = item.candidate?.full_name || 'Ứng viên';
                const position = item.job_post?.position || 'Vị trí';
                
                return {
                    id: item.id,
                    title: 'Lịch phỏng vấn sắp tới',
                    message: `Bạn có lịch phỏng vấn với ${candidateName} cho vị trí ${position}`,
                    created_at: item.createdAt, 
                    type: 'interview',
                    is_read: false
                };
            });

            return {
                err: 0,
                mes: 'Lấy thông báo thành công',
                data: {
                    count: notifications.length,
                    notifications: notifications
                }
            };

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
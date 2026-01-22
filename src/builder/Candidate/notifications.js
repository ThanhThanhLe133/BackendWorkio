import db from '../../models/index.js';

export class CandidateNotificationBuilder {
    constructor() {
        this.candidateId = null;
    }

    setCandidateId(id) {
        this.candidateId = id;
        return this;
    }

    async getNotifications() {
        try {
            const interviews = await db.Interview.findAll({
                where: { candidate_id: this.candidateId },
                include: [
                    {
                        model: db.JobPost,
                        as: 'job_post',
                        attributes: ['id', 'position'], 
                        include: [
                            {
                                model: db.Recruiter,
                                as: 'recruiter',
                                // [SỬA TẠI ĐÂY]: Chỉ lấy company_name, bỏ 'name'
                                attributes: ['company_name'] 
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: 10
            });

            const notifications = interviews.map(item => {
                // [SỬA TẠI ĐÂY]: Chỉ dùng company_name
                const companyName = item.job_post?.recruiter?.company_name || 'Nhà tuyển dụng';
                const jobTitle = item.job_post?.position || 'Công việc'; 

                return {
                    id: item.id,
                    title: 'Lịch phỏng vấn mới',
                    message: `Bạn có lịch phỏng vấn vị trí ${jobTitle} tại ${companyName}`,
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
            throw error;
        }
    }
}
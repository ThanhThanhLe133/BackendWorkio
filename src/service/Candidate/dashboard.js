import { JobPostRepository, InterviewRepository, CandidateRepository, AddressRepository } from '../../repository/index.js';

export const getDashboardStats = (candidate_id) => new Promise(async (resolve, reject) => {
    try {
        const jobRepo = new JobPostRepository();
        const interviewRepo = new InterviewRepository();
        const candidateRepo = new CandidateRepository();
        const addressRepo = new AddressRepository();

        if (!candidate_id) {
            return resolve({ err: 1, mes: "Không tìm thấy ID ứng viên" });
        }

        // 1. Lấy thông tin ứng viên
        let userModel = await candidateRepo.getById(candidate_id);
        let userObj = userModel ? (userModel.toJSON ? userModel.toJSON() : userModel) : {};
        
        // Flatten dữ liệu candidate
        const candidateDetail = userObj.candidate || {};
        
        const profile = {
            id: userObj.id,
            email: userObj.email,
            avatar_url: userObj.avatar_url,
            full_name: candidateDetail.full_name || userObj.name || "Người dùng",
            phone: candidateDetail.phone || userObj.phone || "",
            // Trả về các trường địa chỉ thô để Frontend tự map
            address_info: {
                street: null,
                ward_code: null,
                province_code: null
            }
        };

        // 2. Lấy thông tin Address từ bảng Address dựa vào address_id
        if (candidateDetail.address_id) {
            const address = await addressRepo.getById(candidateDetail.address_id);
            if (address) {
                const addrObj = address.toJSON ? address.toJSON() : address;
                profile.address_info = {
                    street: addrObj.street,
                    ward_code: addrObj.ward_code,
                    province_code: addrObj.province_code
                };
            }
        }

        // --- (PHẦN CODE THỐNG KÊ GIỮ NGUYÊN) ---
        const appliedJobs = await jobRepo.getAllByCandidate(candidate_id);
        const jobStats = {
            total: appliedJobs ? appliedJobs.length : 0,
            data: [
                { name: 'Đang mở', value: 0, color: '#22c55e' },
                { name: 'Đang xem xét', value: 0, color: '#3b82f6' },
                { name: 'Đã tuyển', value: 0, color: '#f59e0b' },
                { name: 'Đã hủy', value: 0, color: '#ef4444' }
            ]
        };

        if (appliedJobs && appliedJobs.length > 0) {
            appliedJobs.forEach(job => {
                const st = (job.status || '').toLowerCase();
                if (st.includes('mở') || st === 'open') jobStats.data[0].value++;
                else if (st.includes('xem xét') || st.includes('review') || st.includes('pending')) jobStats.data[1].value++;
                else if (st.includes('tuyển') || st.includes('hired')) jobStats.data[2].value++;
                else jobStats.data[3].value++;
            });
        }

        const interviews = await interviewRepo.getAllByCandidate(candidate_id);
        
        const interviewStats = {
            total: interviews ? interviews.length : 0,
            upcomingCount: 0,
            passedCount: 0,
            events: [],
            chartData: []
        };

        const now = new Date();
        if (interviews && interviews.length > 0) {
            interviews.forEach(iv => {
                const ivDate = new Date(iv.scheduled_time);
                if (ivDate >= now) interviewStats.upcomingCount++;
                else interviewStats.passedCount++;

                interviewStats.events.push({
                    id: iv.id,
                    date: iv.scheduled_time, 
                    title: `PV: ${iv.job_post?.position || 'Công việc'}`,
                    location: iv.location || 'Online',
                    status: iv.status
                });
            });
        }

        interviewStats.chartData = [
            { name: 'Sắp tới', value: interviewStats.upcomingCount, color: '#8b5cf6' },
            { name: 'Đã qua', value: interviewStats.passedCount, color: '#94a3b8' }
        ];

        resolve({
            err: 0,
            mes: "Lấy thống kê thành công",
            data: { jobStats, interviewStats, profile }
        });

    } catch (error) {
        console.error("Dashboard Service Error:", error);
        resolve({ err: -1, msg: "Lỗi Server: " + error.message });
    }
});
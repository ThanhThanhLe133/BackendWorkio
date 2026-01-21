import db from "../../models/index.js";
import { Op } from "sequelize";

export const getCenterStatistics = async ({ center_id }) =>
    new Promise(async (resolve) => {
        try {
            // Đếm tổng số khóa học đang hoạt động
            const totalCourses = await db.Course.count({
                where: {
                    center_id,
                    is_active: true,
                },
            });

            // Đếm khóa học đang triển khai (có start_date và chưa kết thúc)
            const today = new Date();
            const activeCourses = await db.Course.count({
                where: {
                    center_id,
                    is_active: true,
                    start_date: { [Op.lte]: today },
                    [Op.or]: [
                        { end_date: null },
                        { end_date: { [Op.gte]: today } }
                    ]
                },
            });

            // Đếm khóa học sắp khai giảng (start_date trong tương lai)
            const upcomingCourses = await db.Course.count({
                where: {
                    center_id,
                    is_active: true,
                    start_date: { [Op.gt]: today },
                },
            });

            // Lấy danh sách khóa học với đầy đủ thông tin
            const courses = await db.Course.findAll({
                where: {
                    center_id,
                    is_active: true,
                },
                attributes: ['course_id', 'name', 'candidates', 'duration_hours', 'training_field', 'start_date', 'end_date', 'created_at'],
                order: [['created_at', 'DESC']],
            });

            // 1. Thống kê học viên chi tiết theo trạng thái
            let totalLearners = 0;
            let learningCount = 0;
            let pendingCount = 0;
            let completedCount = 0;
            let rejectedCount = 0;
            
            // 3. Thống kê thời gian
            let totalDurationHours = 0;
            let coursesWithDuration = 0;
            
            // 4. Thống kê theo training field
            const trainingFieldStats = {};
            
            // 5. Dữ liệu cho top courses
            const coursesData = [];

            courses.forEach(course => {
                if (course.candidates && Array.isArray(course.candidates)) {
                    const candidatesCount = course.candidates.length;
                    totalLearners += candidatesCount;

                    // Đếm theo trạng thái
                    const learning = course.candidates.filter(c => c.status === 'dang_hoc').length;
                    const pending = course.candidates.filter(c => c.status === 'cho_duyet').length;
                    const completed = course.candidates.filter(c => c.status === 'da_hoc').length;
                    const rejected = course.candidates.filter(c => c.status === 'tu_choi').length;

                    learningCount += learning;
                    pendingCount += pending;
                    completedCount += completed;
                    rejectedCount += rejected;

                    // Tính tỉ lệ hoàn thành của khóa học
                    const completionRate = candidatesCount > 0 
                        ? Math.round((completed / candidatesCount) * 100) 
                        : 0;

                    // Lưu data cho top courses
                    coursesData.push({
                        course_id: course.course_id,
                        name: course.name,
                        learners: candidatesCount,
                        learning: learning,
                        completed: completed,
                        completionRate: completionRate,
                        start_date: course.start_date,
                        end_date: course.end_date,
                    });
                }

                // Thống kê thời gian
                if (course.duration_hours && course.duration_hours > 0) {
                    totalDurationHours += course.duration_hours;
                    coursesWithDuration++;
                }

                // Thống kê theo training field
                const trainingField = course.training_field || 'Chưa phân loại';
                if (!trainingFieldStats[trainingField]) {
                    trainingFieldStats[trainingField] = {
                        courses: 0,
                        learners: 0,
                        learning: 0,
                        completed: 0,
                        pending: 0,
                        rejected: 0,
                    };
                }
                trainingFieldStats[trainingField].courses += 1;
                if (course.candidates && Array.isArray(course.candidates)) {
                    trainingFieldStats[trainingField].learners += course.candidates.length;
                    trainingFieldStats[trainingField].learning += course.candidates.filter(c => c.status === 'dang_hoc').length;
                    trainingFieldStats[trainingField].completed += course.candidates.filter(c => c.status === 'da_hoc').length;
                    trainingFieldStats[trainingField].pending += course.candidates.filter(c => c.status === 'cho_duyet').length;
                    trainingFieldStats[trainingField].rejected += course.candidates.filter(c => c.status === 'tu_choi').length;
                }
            });

            // 3. Tính thời gian trung bình
            const avgDurationHours = coursesWithDuration > 0 
                ? Math.round(totalDurationHours / coursesWithDuration) 
                : 0;

            // 5. Top 5 courses theo số học viên
            const topCoursesByLearners = coursesData
                .sort((a, b) => b.learners - a.learners)
                .slice(0, 5)
                .map(c => ({
                    course_id: c.course_id,
                    name: c.name,
                    learners: c.learners,
                    completionRate: c.completionRate,
                }));

            // Top 5 courses theo tỉ lệ hoàn thành (chỉ lấy khóa có ít nhất 5 học viên)
            const topCoursesByCompletion = coursesData
                .filter(c => c.learners >= 5)
                .sort((a, b) => b.completionRate - a.completionRate)
                .slice(0, 5)
                .map(c => ({
                    course_id: c.course_id,
                    name: c.name,
                    learners: c.learners,
                    completionRate: c.completionRate,
                }));

            // 6. Xu hướng theo thời gian - khóa học được tạo trong 3 tháng gần nhất
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const recentCourses = await db.Course.count({
                where: {
                    center_id,
                    is_active: true,
                    created_at: { [Op.gte]: threeMonthsAgo },
                },
            });

            // Khóa học được tạo trong tháng này
            const thisMonthStart = new Date();
            thisMonthStart.setDate(1);
            thisMonthStart.setHours(0, 0, 0, 0);

            const coursesThisMonth = await db.Course.count({
                where: {
                    center_id,
                    is_active: true,
                    created_at: { [Op.gte]: thisMonthStart },
                },
            });

            // Tính tỉ lệ hoàn thành tổng
            const overallCompletionRate = totalLearners > 0 
                ? Math.round((completedCount / totalLearners) * 100) 
                : 0;

            // Chuyển trainingFieldStats thành array và sắp xếp theo số học viên
            const trainingFieldArray = Object.entries(trainingFieldStats)
                .map(([field, stats]) => ({
                    field,
                    ...stats,
                    completionRate: stats.learners > 0 
                        ? Math.round((stats.completed / stats.learners) * 100) 
                        : 0,
                }))
                .sort((a, b) => b.learners - a.learners);

            const statistics = {
                courses: {
                    total: totalCourses,
                    active: activeCourses,
                    upcoming: upcomingCourses,
                },
                learners: {
                    total: totalLearners,
                    active: learningCount,
                    // 1. Chi tiết theo trạng thái
                    byStatus: {
                        learning: learningCount,
                        pending: pendingCount,
                        completed: completedCount,
                        rejected: rejectedCount,
                    },
                },
                completionRate: overallCompletionRate,
                // 3. Thống kê thời gian
                duration: {
                    totalHours: totalDurationHours,
                    avgHours: avgDurationHours,
                    coursesWithDuration: coursesWithDuration,
                },
                // 4. Thống kê theo lĩnh vực đào tạo
                byTrainingField: trainingFieldArray,
                // 5. Top courses
                topCourses: {
                    byLearners: topCoursesByLearners,
                    byCompletion: topCoursesByCompletion,
                },
                // 6. Xu hướng
                trends: {
                    coursesLast3Months: recentCourses,
                    coursesThisMonth: coursesThisMonth,
                },
            };

            resolve({
                err: 0,
                mes: "Lấy thống kê thành công",
                data: statistics,
            });
        } catch (error) {
            console.error("Get statistics error:", error);
            resolve({
                err: 1,
                mes: error.message || "Lỗi khi lấy thống kê",
            });
        }
    });

import { CourseRepository, CandidateRepository } from '../../repository/index.js';
import { STUDENT_STATUSES } from '../../builder/Center/course-management.js';

const buildLocation = (address = {}) => {
    if (!address) return null;
    const parts = [address.street, address.ward_code, address.province_code].filter(Boolean);
    return parts.length ? parts.join(', ') : null;
};

const normalizeCenter = (center = {}) => {
    if (!center || !Object.keys(center).length) return null;
    const address = center.address
        ? {
            street: center.address.street || null,
            ward_code: center.address.ward_code || null,
            district_code: center.address.district_code || null,
            province_code: center.address.province_code || null,
        }
        : null;

    return {
        id: center.center_id || center.id || null,
        name: center.name || null,
        email: center.email || null,
        phone: center.phone || null,
        website: center.website || null,
        address,
    };
};

const normalizeCourseRecord = (courseRecord, candidate_id) => {
    const plain = courseRecord?.toJSON ? courseRecord.toJSON() : courseRecord;
    const center = plain?.center || {};
    const candidates = Array.isArray(plain?.candidates) ? plain.candidates : [];
    const candidateEntry = candidates.find((item) => item.candidate_id === candidate_id);
    const canRegister = !candidateEntry;

    return {
        id: plain.course_id,
        course_id: plain.course_id,
        name: plain.name,
        description: plain.description,
        training_field: plain.training_field,
        occupation_type: plain.occupation_type,
        summary: plain.summary,
        details: plain.details,
        start_date: plain.start_date,
        end_date: plain.end_date,
        duration_hours: plain.duration_hours,
        center_id: plain.center_id,
        center_name: center?.name || center?.center?.name || null,
        center_phone: center?.phone || null,
        center_email: center?.email || null,
        center_website: center?.website || null,
        location: buildLocation(center?.address),
        registered_count: candidates.length,
        candidate_status: candidateEntry?.status || null,
        candidate_notes: candidateEntry?.notes || null,
        candidate_requested_at: candidateEntry?.requested_at || null,
        tags: plain.training_field ? [plain.training_field] : [],
        center: normalizeCenter(center),
        can_register: canRegister,
    };
};

export const getCandidateCoursesForCandidate = ({ candidate_id }) =>
    new Promise(async (resolve) => {
        try {
            const courseRepo = new CourseRepository();
            const courses = await courseRepo.getAllActiveWithCenter();
            const data = courses.map((course) => normalizeCourseRecord(course, candidate_id));
            resolve({ err: 0, mes: 'Lấy danh sách khóa học thành công', data });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const registerCandidateCourse = ({ candidate_id, course_id }) =>
    new Promise(async (resolve) => {
        try {
            const candidateRepo = new CandidateRepository();
            const candidate = await candidateRepo.getDetailByCandidateId(candidate_id);
            if (!candidate) throw new Error('Không tìm thấy ứng viên');

            const courseRepo = new CourseRepository();
            const course = await courseRepo.getDetail(course_id);
            if (!course) throw new Error('Không tìm thấy khóa học');
            if (course.is_active === false) throw new Error('Khóa học đang tạm ngưng');
            if (course.center?.is_active === false) throw new Error('Trung tâm đang tạm ngưng');

            const candidates = Array.isArray(course.candidates) ? [...course.candidates] : [];
            if (candidates.some((item) => item.candidate_id === candidate_id)) {
                throw new Error('Bạn đã đăng ký khóa học này');
            }

            candidates.push({
                candidate_id,
                status: STUDENT_STATUSES.PENDING,
                attendance: 0,
                tuition_confirmed: false,
                signed_at: null,
                notes: null,
                requested_at: new Date().toISOString(),
            });

            await courseRepo.updateCourse(course_id, { candidates });

            resolve({
                err: 0,
                mes: 'Đã gửi yêu cầu đăng ký khóa học. Vui lòng chờ trung tâm duyệt.',
                data: {
                    course_id,
                    status: STUDENT_STATUSES.PENDING,
                },
            });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

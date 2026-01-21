import { CandidateRepository, CenterRepository, CourseRepository } from "../../repository/index.js";

export const STUDENT_STATUSES = {
    PENDING: 'cho_duyet',
    LEARNING: 'dang_hoc',
    COMPLETED: 'da_hoc',
    REJECTED: 'tu_choi',
};

export const ALLOWED_STUDENT_STATUSES = Object.values(STUDENT_STATUSES);

const ALLOWED_STATUSES = ALLOWED_STUDENT_STATUSES;
const ALLOWED_COURSE_FIELDS = [
    'name',
    'description',
    'summary',
    'details',
    'start_date',
    'end_date',
    'capacity',
    'training_field',
    'duration_hours',
];

export class CourseManagement {
    constructor() {
        this.centerRepo = new CenterRepository();
        this.courseRepo = new CourseRepository();
        this.candidateRepo = new CandidateRepository();

        this.centerId = null;
        this.courseData = {};
        this.courseId = null;
        this.candidateId = null;
        this.status = STUDENT_STATUSES.LEARNING;
    }

    setCenterId(centerId) {
        this.centerId = centerId;
        return this;
    }

    setCourseData(data) {
        this.courseData = data;
        return this;
    }

    setCourseId(courseId) {
        this.courseId = courseId;
        return this;
    }

    setCandidateId(candidateId) {
        this.candidateId = candidateId;
        return this;
    }

    setStatus(status) { this.status = status; return this; }
    setAttendance(attendance) { this.attendance = attendance; return this; }
    setTuitionConfirmed(confirmed) { this.tuition_confirmed = confirmed; return this; }
    setSignedAt(date) { this.signed_at = date; return this; }
    setNotes(notes) { this.notes = notes; return this; }

    async ensureCenterActive() {
        const center = await this.centerRepo.getCenterById(this.centerId);
        if (!center) throw new Error('Không tìm thấy trung tâm');
        if (center.is_active === false) throw new Error('Tài khoản trung tâm đang bị khóa');
        return center;
    }

    async createCourse() {
        await this.ensureCenterActive();
        if (!this.courseData?.name) throw new Error('Tên khóa học là bắt buộc');
        const payload = {
            ...this.courseData,
            center_id: this.centerId,
            candidates: []
        };
        const course = await this.courseRepo.createCourse(payload);
        return {
            err: 0,
            mes: 'Tạo khóa học thành công',
            data: course
        };
    }

    async updateCourse() {
        await this.ensureCenterActive();
        if (!this.courseId) throw new Error('Thiếu mã khóa học');

        const course = await this.courseRepo.getById(this.courseId);
        if (!course || course.center_id !== this.centerId) throw new Error('Không tìm thấy khóa học');

        const payload = {};
        ALLOWED_COURSE_FIELDS.forEach((field) => {
            if (this.courseData?.[field] !== undefined) {
                payload[field] = this.courseData[field];
            }
        });

        if (!Object.keys(payload).length) throw new Error('Không có dữ liệu để cập nhật');

        const updated = await this.courseRepo.updateCourse(this.courseId, payload);
        return {
            err: 0,
            mes: 'Cập nhật khóa học thành công',
            data: updated,
        };
    }

    async deleteCourse() {
        await this.ensureCenterActive();
        if (!this.courseId) throw new Error('Thiếu mã khóa học');

        const course = await this.courseRepo.getById(this.courseId);
        if (!course || course.center_id !== this.centerId) throw new Error('Không tìm thấy khóa học');

        const candidates = Array.isArray(course.candidates) ? course.candidates : [];
        const hasLearningStudents = candidates.some(
            (candidate) => candidate?.status === STUDENT_STATUSES.LEARNING
        );
        if (hasLearningStudents) {
            throw new Error('Không thể xóa khóa học khi vẫn còn học viên đang học');
        }

        await this.courseRepo.deleteCourse(this.courseId);
        return {
            err: 0,
            mes: 'Xóa khóa học thành công',
        };
    }

    async enrichCoursesWithCandidateInfo(courses) {
        if (!Array.isArray(courses) || !courses.length) {
            if (Array.isArray(courses)) {
                return courses.map((course) => (course?.toJSON ? course.toJSON() : course));
            }
            return [];
        }

        const plainCourses = courses.map((course) => (course?.toJSON ? course.toJSON() : course));
        const candidateIds = new Set();

        plainCourses.forEach((course) => {
            const list = Array.isArray(course.candidates) ? course.candidates : [];
            list.forEach((candidate) => {
                if (candidate?.candidate_id) {
                    candidateIds.add(candidate.candidate_id);
                }
            });
        });

        if (!candidateIds.size) return plainCourses;

        const basicCandidates = await this.candidateRepo.getBasicByIds([...candidateIds]);
        const candidateMap = new Map();
        basicCandidates.forEach((record) => {
            const json = record?.toJSON ? record.toJSON() : record;
            if (json?.candidate_id) {
                candidateMap.set(json.candidate_id, json);
            }
        });

        return plainCourses.map((course) => {
            const list = Array.isArray(course.candidates) ? course.candidates : [];
            course.candidates = list.map((student) => {
                const info = candidateMap.get(student.candidate_id);
                if (!info) return student;

                const candidateName =
                    info.full_name ||
                    info.candidate?.name ||
                    student.name ||
                    student.candidate_name ||
                    null;

                const contactEmail = info.email || info.candidate?.email || student.email || null;
                const contactPhone = info.phone || student.phone || null;

                return {
                    ...student,
                    candidate_name: candidateName,
                    name: candidateName,
                    email: contactEmail,
                    phone: contactPhone,
                    candidate: info.candidate
                        ? {
                            id: info.candidate.id,
                            name: info.candidate.name || candidateName,
                            email: info.candidate.email || contactEmail,
                            full_name: info.full_name || candidateName,
                        }
                        : student.candidate || null,
                };
            });
            return course;
        });
    }

    async getCoursesByCenter() {
        await this.ensureCenterActive();
        const courses = await this.courseRepo.getByCenterId(this.centerId);
        
        if (!courses || courses.length === 0) {
            return {
                err: 0,
                mes: 'Lấy danh sách khóa học thành công',
                data: []
            };
        }

        // Lấy tất cả candidate IDs từ các khóa học
        const candidateIds = new Set();
        courses.forEach(course => {
            if (Array.isArray(course.candidates)) {
                course.candidates.forEach(c => {
                    if (c.candidate_id) candidateIds.add(c.candidate_id);
                });
            }
        });

        // Nếu không có candidates, trả về luôn
        if (candidateIds.size === 0) {
            return {
                err: 0,
                mes: 'Lấy danh sách khóa học thành công',
                data: courses
            };
        }

        // Lấy thông tin candidates
        const candidates = await this.candidateRepo.getCandidatesByIds([...candidateIds]);
        const candidateMap = new Map();
        candidates.forEach(candidate => {
            candidateMap.set(candidate.candidate_id, {
                full_name: candidate.full_name,
                email: candidate.email,
                phone: candidate.phone
            });
        });

        // Map thêm name, email, phone vào mỗi candidate
        const coursesWithNames = courses.map(course => {
            const courseData = course.toJSON ? course.toJSON() : course;
            if (Array.isArray(courseData.candidates)) {
                courseData.candidates = courseData.candidates.map(c => {
                    const info = candidateMap.get(c.candidate_id);
                    return {
                        ...c,
                        name: info?.full_name || null,
                        email: info?.email || null,
                        phone: info?.phone || null
                    };
                });
            }
            return courseData;
        });

        return {
            err: 0,
            mes: 'Lấy danh sách khóa học thành công',
            data: coursesWithNames
        };
    }

    async addCandidateToCourse() {
        await this.ensureCenterActive();
        const [course, candidate] = await Promise.all([
            this.courseRepo.getById(this.courseId),
            this.candidateRepo.getDetailByCandidateId(this.candidateId)
        ]);

        if (!course || course.center_id !== this.centerId) throw new Error('Không tìm thấy khóa học');
        if (!candidate) throw new Error('Không tìm thấy học viên');

        const candidates = Array.isArray(course.candidates) ? [...course.candidates] : [];
        const existed = candidates.find((item) => item.candidate_id === this.candidateId);
        if (existed) throw new Error('Học viên đã được thêm vào khóa học');

        candidates.push({
            candidate_id: this.candidateId,
            status: STUDENT_STATUSES.LEARNING,
            attendance: 0,
            tuition_confirmed: false,
            signed_at: null,
            notes: null,
            requested_at: new Date().toISOString(),
        });

        await this.courseRepo.updateCourse(this.courseId, { candidates });

        return {
            err: 0,
            mes: 'Thêm học viên vào khóa học thành công',
            data: candidates
        };
    }

    async removeCandidateFromCourse() {
        await this.ensureCenterActive();
        if (!this.candidateId) throw new Error('Thiếu mã học viên');

        const course = await this.courseRepo.getById(this.courseId);
        if (!course || course.center_id !== this.centerId) throw new Error('Không tìm thấy khóa học');

        const candidates = Array.isArray(course.candidates) ? [...course.candidates] : [];
        const index = candidates.findIndex((item) => item.candidate_id === this.candidateId);
        if (index === -1) throw new Error('Học viên chưa có trong khóa học');

        candidates.splice(index, 1);
        await this.courseRepo.updateCourse(this.courseId, { candidates });

        return {
            err: 0,
            mes: 'Đã xóa học viên khỏi khóa học',
            data: candidates,
        };
    }

    async updateCandidateStatus() {
        await this.ensureCenterActive();
        const course = await this.courseRepo.getById(this.courseId);
        if (!course || course.center_id !== this.centerId) throw new Error('Không tìm thấy khóa học');

        const candidates = Array.isArray(course.candidates) ? [...course.candidates] : [];
        const target = candidates.find((item) => item.candidate_id === this.candidateId);
        if (!target) throw new Error('Học viên chưa có trong khóa học');
        if (!ALLOWED_STATUSES.includes(this.status)) throw new Error('Trạng thái học viên không hợp lệ');

        target.status = this.status;
        if (this.attendance !== undefined) target.attendance = this.attendance;
        if (this.tuition_confirmed !== undefined) target.tuition_confirmed = this.tuition_confirmed;
        if (this.signed_at !== undefined) target.signed_at = this.signed_at;
        if (this.notes !== undefined) target.notes = this.notes;
        await this.courseRepo.updateCourse(this.courseId, { candidates });

        return {
            err: 0,
            mes: 'Cập nhật trạng thái học viên thành công',
            data: candidates
        };
    }

    async getNotifications() {
        await this.ensureCenterActive();
        
        const courses = await this.courseRepo.getByCenterId(this.centerId);
        if (!courses || !courses.length) {
            return {
                err: 0,
                mes: 'Không có thông báo',
                data: {
                    count: 0,
                    notifications: []
                }
            };
        }

        const notifications = [];
        const plainCourses = courses.map((course) => (course?.toJSON ? course.toJSON() : course));

        // Collect all candidate IDs from pending requests
        const pendingCandidateIds = new Set();
        plainCourses.forEach((course) => {
            const candidates = Array.isArray(course.candidates) ? course.candidates : [];
            candidates.forEach((candidate) => {
                if (candidate.status === STUDENT_STATUSES.PENDING && candidate.candidate_id) {
                    pendingCandidateIds.add(candidate.candidate_id);
                }
            });
        });

        // Fetch candidate details in batch
        let candidateMap = new Map();
        if (pendingCandidateIds.size > 0) {
            const candidateDetails = await this.candidateRepo.getCandidatesByIds([...pendingCandidateIds]);
            candidateDetails.forEach((candidate) => {
                candidateMap.set(candidate.candidate_id, {
                    full_name: candidate.full_name,
                    email: candidate.email,
                    phone: candidate.phone
                });
            });
        }

        // Build notifications
        plainCourses.forEach((course) => {
            const candidates = Array.isArray(course.candidates) ? course.candidates : [];
            const pendingCandidates = candidates.filter(
                (candidate) => candidate.status === STUDENT_STATUSES.PENDING
            );

            pendingCandidates.forEach((candidate) => {
                const candidateInfo = candidateMap.get(candidate.candidate_id) || {};
                notifications.push({
                    id: `${course.course_id}-${candidate.candidate_id}`,
                    course_id: course.course_id,
                    course_name: course.name,
                    candidate_id: candidate.candidate_id,
                    candidate_name: candidateInfo.full_name || 'Học viên',
                    candidate_email: candidateInfo.email,
                    candidate_phone: candidateInfo.phone,
                    requested_at: candidate.requested_at,
                    type: 'pending_enrollment'
                });
            });
        });

        // Sort by requested_at desc (newest first)
        notifications.sort((a, b) => {
            const timeA = a.requested_at ? new Date(a.requested_at).getTime() : 0;
            const timeB = b.requested_at ? new Date(b.requested_at).getTime() : 0;
            return timeB - timeA;
        });

        return {
            err: 0,
            mes: 'Lấy thông báo thành công',
            data: {
                count: notifications.length,
                notifications
            }
        };
    }
}

import { CandidateRepository, CenterRepository, CourseRepository } from "../../repository/index.js";

export const STUDENT_STATUSES = {
    LEARNING: 'dang_hoc',
    COMPLETED: 'da_hoc',
};

export const ALLOWED_STUDENT_STATUSES = Object.values(STUDENT_STATUSES);

const ALLOWED_STATUSES = ALLOWED_STUDENT_STATUSES;

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

    async getCoursesByCenter() {
        await this.ensureCenterActive();
        const courses = await this.courseRepo.getByCenterId(this.centerId);
        return {
            err: 0,
            mes: 'Lấy danh sách khóa học thành công',
            data: courses?.length ? courses : []
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
        });

        await this.courseRepo.updateCourse(this.courseId, { candidates });

        return {
            err: 0,
            mes: 'Thêm học viên vào khóa học thành công',
            data: candidates
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
}

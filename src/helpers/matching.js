import { buildMatchingVector } from "./candidate-profile.js";

const normalizeToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return trimmed
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
    }
    return [value];
};

const normalizeJobFields = (fields) => {
    const array = normalizeToArray(fields);
    return array
        .flatMap((field) => {
            if (field && typeof field === "object") {
                if (Array.isArray(field.industry)) return field.industry;
                if (field.industry) return [field.industry];
            }
            return field ? [field] : [];
        })
        .map((f) => String(f).toLowerCase()); // Chuyển về chữ thường để so sánh chính xác hơn
};

// TĂNG TRỌNG SỐ BẰNG CẤP (Tổng max ~ 20 điểm)
const degreeWeights = {
    Doctorate: 20,
    Master: 15,
    Bachelor: 10,
    Associate: 8,
    Vocational: 5,
    HighSchool: 2,
    Secondary: 1,
    Primary: 0,
    Certificate: 5,
    Custom: 2,
};

export const calculateMatchScore = (jobPost, candidate) => {
    const job = jobPost?.toJSON ? jobPost.toJSON() : jobPost;
    const candidateRoot = candidate?.candidate ?? candidate;

    // Nếu chưa có vector thì build lại, đảm bảo không null
    const vector =
        candidateRoot?.matching_vector ??
        buildMatchingVector(
            candidateRoot,
            candidateRoot?.study_history,
            candidateRoot?.work_experience,
        );

    let score = 0;

    // 1. NGÀNH NGHỀ (Quan trọng nhất - Max 40 điểm)
    const candidateFields = normalizeToArray(vector.fields_wish).map((s) =>
        String(s).toLowerCase(),
    );
    const jobFields = normalizeJobFields(job?.fields);

    // So sánh ngành nghề (dùng includes để linh hoạt hơn)
    const sharedFields = candidateFields.filter((cf) =>
        jobFields.some((jf) => jf.includes(cf) || cf.includes(jf)),
    );
    // Mỗi ngành khớp +20 điểm (tối đa 40)
    score += Math.min(sharedFields.length * 20, 40);

    // 2. LĨNH VỰC ĐÀO TẠO (Max 10 điểm)
    const trainingFields = normalizeToArray(vector.training_fields).map((s) =>
        String(s).toLowerCase(),
    );
    const trainingMatches = trainingFields.filter((tf) =>
        jobFields.some((jf) => jf.includes(tf) || tf.includes(jf)),
    );
    if (trainingMatches.length > 0) score += 10;

    // 3. BẰNG CẤP (Max 20 điểm)
    if (vector.highest_degree_level) {
        score += degreeWeights[vector.highest_degree_level] || 0;
    }

    // 4. KINH NGHIỆM (Max 15 điểm)
    const experienceYears = vector.total_experience_years || 0;
    // Mỗi năm kinh nghiệm +3 điểm, tối đa 5 năm (15 điểm)
    score += Math.min(experienceYears, 5) * 3;

    // 5. KỸ NĂNG & YÊU CẦU KHÁC (Max 15 điểm)
    // Xếp loại tốt nghiệp khớp: +5đ
    if (
        candidateRoot?.graduation_rank &&
        job?.graduation_rank &&
        candidateRoot.graduation_rank === job.graduation_rank
    )
        score += 5;

    // Tin học khớp: +5đ
    if (
        candidateRoot?.computer_skill &&
        job?.computer_skill &&
        candidateRoot.computer_skill === job.computer_skill
    )
        score += 5;

    // Loại công việc khớp: +2.5đ
    if (
        candidateRoot?.job_type &&
        job?.job_type &&
        candidateRoot.job_type === job.job_type
    )
        score += 2.5;

    // Thời gian làm việc khớp: +2.5đ
    if (
        candidateRoot?.working_time &&
        job?.working_time &&
        candidateRoot.working_time === job.working_time
    )
        score += 2.5;

    // 6. NGÔN NGỮ (Cộng thêm điểm thưởng - Bonus)
    const jobLanguages = normalizeToArray(job?.languguages).map(
        (l) => l?.toLowerCase?.() || l,
    );
    const candidateLanguages = normalizeToArray(vector.languages).map(
        (l) => l?.toLowerCase?.() || l,
    );

    const sharedLanguages = candidateLanguages.filter((lang) =>
        jobLanguages.some((jl) => jl.includes(lang) || lang.includes(jl)),
    );

    if (sharedLanguages.length) {
        score += 5 + (sharedLanguages.length - 1) * 2; // Ít nhất 5 điểm
    }

    if (vector.trained_at_center) score += 5; // Học viên trung tâm ưu tiên +5

    // Đảm bảo không vượt quá 100
    return Math.min(Math.round(score), 100);
};

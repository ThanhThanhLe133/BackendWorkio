// File: matching.js
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
        .map((f) => String(f).toLowerCase());
};

const degreeWeights = {
    Doctorate: 20, Master: 15, Bachelor: 10, Associate: 8,
    Vocational: 5, HighSchool: 2, Secondary: 1, Primary: 0,
    Certificate: 5, Custom: 2,
};

export const calculateMatchScore = (jobPost, candidate) => {
    const job = jobPost?.toJSON ? jobPost.toJSON() : jobPost;
    
    // --- FIX LỖI NGHIÊM TRỌNG TẠI ĐÂY ---
    // Kiểm tra xem object hiện tại có phải là Profile (chứa matching_vector) không.
    // Nếu có, dùng chính nó. Nếu không, mới thử tìm trong property con.
    const isProfile = candidate.matching_vector || candidate.fields_wish;
    const candidateRoot = isProfile ? candidate : (candidate.candidate ?? candidate);

    // Build vector nếu chưa có (Fallback)
    const vector =
        candidateRoot?.matching_vector ??
        buildMatchingVector(
            candidateRoot,
            candidateRoot?.study_history,
            candidateRoot?.work_experience,
        );

    let score = 0;

    // --- 1. ĐỊA ĐIỂM (QUAN TRỌNG) ---
    // Fallback: Lấy province của Job -> Recruiter Address -> Recruiter Info
    const jobProvince = job.province_code || job.recruiter?.address?.province_code || job.recruiter?.province_code;
    const candProvince = candidateRoot.address?.province_code || candidateRoot.province_code;

    // Ép kiểu String để so sánh an toàn
    if (jobProvince && candProvince && String(jobProvince) === String(candProvince)) {
        score += 15;
    }

    // --- 2. NGÀNH NGHỀ (Max 40 điểm) ---
    const candidateFields = normalizeToArray(vector.fields_wish).map((s) => String(s).toLowerCase());
    const jobFields = normalizeJobFields(job?.fields);

    const sharedFields = candidateFields.filter((cf) => jobFields.some(jf => jf.includes(cf) || cf.includes(jf)));
    score += Math.min(sharedFields.length * 20, 40);

    // --- 3. LĨNH VỰC ĐÀO TẠO (Max 10 điểm) ---
    const trainingFields = normalizeToArray(vector.training_fields).map((s) => String(s).toLowerCase());
    const trainingMatches = trainingFields.filter((tf) => jobFields.some(jf => jf.includes(tf) || tf.includes(jf)));
    if (trainingMatches.length > 0) score += 10;

    // --- 4. BẰNG CẤP (Max 20 điểm) ---
    if (vector.highest_degree_level) {
        score += degreeWeights[vector.highest_degree_level] || 0;
    }

    // --- 5. KINH NGHIỆM (Max 15 điểm) ---
    const experienceYears = vector.total_experience_years || 0;
    score += Math.min(experienceYears, 5) * 3;

    // --- 6. TIÊU CHÍ PHỤ ---
    if (candidateRoot?.graduation_rank && job?.graduation_rank && candidateRoot.graduation_rank === job.graduation_rank)
        score += 5;
    if (candidateRoot?.computer_skill && job?.computer_skill && candidateRoot.computer_skill === job.computer_skill)
        score += 5;
    if (candidateRoot?.job_type && job?.job_type && candidateRoot.job_type === job.job_type)
        score += 2.5;
    if (candidateRoot?.working_time && job?.working_time && candidateRoot.working_time === job.working_time)
        score += 2.5;

    // --- 7. NGÔN NGỮ (Bonus) ---
    // Handle cả key cũ (languguages) và key mới
    const jobLangsRaw = job?.languguages || job?.languages;
    const jobLangs = normalizeToArray(jobLangsRaw).map(l => l?.toLowerCase?.() || l);
    const candLangs = normalizeToArray(vector.languages).map(l => l?.toLowerCase?.() || l);
    
    const sharedLangs = candLangs.filter(cl => jobLangs.some(jl => jl.includes(cl) || cl.includes(jl)));
    if (sharedLangs.length) {
        score += 5 + (sharedLangs.length - 1) * 2;
    }

    if (vector.trained_at_center) score += 5;

    // --- KẾT QUẢ ---
    const finalScore = Math.min(score, 100);
    return Number((finalScore / 100).toFixed(2)); // Trả về 0.xx
};
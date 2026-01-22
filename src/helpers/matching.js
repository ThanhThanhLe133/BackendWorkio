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
        .map((f) => String(f).toLowerCase().trim());
};

const degreeWeights = {
    Doctorate: 20, Master: 15, Bachelor: 10, Associate: 8,
    Vocational: 5, HighSchool: 2, Secondary: 1, Primary: 0,
    Certificate: 5, Custom: 2,
};

export const calculateMatchScore = (jobPost, candidate) => {
    // 1. Chuẩn hóa Job
    const job = jobPost?.toJSON ? jobPost.toJSON() : jobPost;
    
    // 2. Chuẩn hóa Candidate & Vector
    const isProfile = candidate.matching_vector || candidate.fields_wish;
    const candidateRoot = isProfile ? candidate : (candidate.candidate ?? candidate);

    // Fallback: Nếu không có matching_vector, thử build tạm hoặc lấy từ fields_wish
    const vector = candidateRoot?.matching_vector ?? {
        fields_wish: candidateRoot.fields_wish || [],
        training_fields: [], // Có thể lấy từ study_history nếu cần
        highest_degree_level: candidateRoot.graduation_rank || 'Custom',
        total_experience_years: candidateRoot.work_experience?.length || 0, // Tính tạm số năm
        languages: candidateRoot.languguages || []
    };

    let score = 0;

    // --- 1. ĐỊA ĐIỂM (Max 15 điểm) ---
    // Logic: So sánh province_code. Cần ép kiểu về String để tránh lỗi '79' !== 79
    const jobProvince = job.province_code || job.address?.province_code || job.recruiter?.address?.province_code || job.recruiter?.province_code;
    const candProvince = candidateRoot.address?.province_code || candidateRoot.province_code;

    if (jobProvince && candProvince && String(jobProvince) === String(candProvince)) {
        score += 15;
    }

    // --- 2. NGÀNH NGHỀ (Max 40 điểm) ---
    const candidateFields = normalizeToArray(vector.fields_wish).map((s) => String(s).toLowerCase().trim());
    const jobFields = normalizeJobFields(job?.fields);

    // Tìm điểm chung (Partial match: ví dụ "IT" khớp "IT phần mềm")
    const sharedFields = candidateFields.filter((cf) => 
        jobFields.some(jf => jf.includes(cf) || cf.includes(jf))
    );
    
    if (sharedFields.length > 0) {
        // Nếu có ít nhất 1 ngành trùng => +20đ, mỗi ngành thêm +10đ, max 40
        score += 20 + (sharedFields.length - 1) * 10;
        if (score > 40 + 15) score = 55; // (Giới hạn logic cục bộ)
    }

    // --- 3. LĨNH VỰC ĐÀO TẠO (Max 10 điểm) ---
    // (Bỏ qua nếu không có dữ liệu để tránh trừ điểm oan)
    if (vector.training_fields && vector.training_fields.length > 0) {
        const trainingFields = normalizeToArray(vector.training_fields).map((s) => String(s).toLowerCase());
        const trainingMatches = trainingFields.filter((tf) => jobFields.some(jf => jf.includes(tf) || tf.includes(jf)));
        if (trainingMatches.length > 0) score += 10;
    }

    // --- 4. BẰNG CẤP (Max 20 điểm) ---
    // Mapping lại graduation_rank của candidate sang degreeWeights nếu cần
    let degreeScore = 0;
    if (vector.highest_degree_level) {
        degreeScore = degreeWeights[vector.highest_degree_level] || 0;
    } else if (candidateRoot.graduation_rank) {
        // Fallback mapping
        if (candidateRoot.graduation_rank === 'Đại học') degreeScore = 10;
        else if (candidateRoot.graduation_rank === 'Cấp 3') degreeScore = 5;
    }
    score += degreeScore;

    // --- 5. KINH NGHIỆM (Max 15 điểm) ---
    const experienceYears = vector.total_experience_years || 0;
    score += Math.min(experienceYears * 3, 15);

    // --- 6. CÁC TIÊU CHÍ PHỤ (Bonus) ---
    // Xếp loại tốt nghiệp
    if (candidateRoot?.graduation_rank && job?.graduation_rank) {
        if (candidateRoot.graduation_rank === job.graduation_rank) score += 5;
    }

    // Tin học
    if (candidateRoot?.computer_skill && job?.computer_skill) {
        if (candidateRoot.computer_skill === job.computer_skill) score += 5;
    }

    // Hình thức làm việc
    if (candidateRoot?.job_type && job?.job_type) {
        if (candidateRoot.job_type === job.job_type) score += 5;
    }

    // Ngôn ngữ
    const jobLanguages = normalizeToArray(job?.languguages || job?.languages).map(l => String(l).toLowerCase());
    const candLanguages = normalizeToArray(vector.languages).map(l => String(l).toLowerCase());
    
    const sharedLangs = candLanguages.filter(cl => jobLanguages.some(jl => jl.includes(cl) || cl.includes(jl)));
    if (sharedLangs.length > 0) score += 5;

    // --- [FIX QUAN TRỌNG] TRẢ VỀ SỐ NGUYÊN (0-100) ---
    // Không chia cho 100 nữa để Frontend hiển thị đúng (VD: 65 thay vì 0.65)
    return Math.min(Math.round(score), 100);
};
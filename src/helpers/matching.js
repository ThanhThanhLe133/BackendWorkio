import { buildMatchingVector } from './candidate-profile.js';

const normalizeToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            // Fallback: treat as comma-separated string
            return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
    }

    return [value];
};

const normalizeJobFields = (fields) => {
    const array = normalizeToArray(fields);
    return array
        .flatMap((field) => {
            if (field && typeof field === 'object') {
                if (Array.isArray(field.industry)) return field.industry;
                if (field.industry) return [field.industry];
            }
            return field ? [field] : [];
        })
        .map((f) => String(f));
};

const degreeWeights = {
    Doctorate: 2.5,
    Master: 2,
    Bachelor: 1.5,
    Associate: 1.2,
    Vocational: 1,
    HighSchool: 0.5,
    Secondary: 0.25,
    Primary: 0.1,
    Certificate: 0.75,
    Custom: 0.5,
};

export const calculateMatchScore = (jobPost, candidate) => {
    const job = jobPost?.toJSON ? jobPost.toJSON() : jobPost;
    const candidateRoot = candidate?.candidate ?? candidate;
    const vector = candidateRoot?.matching_vector ?? buildMatchingVector(candidateRoot, candidateRoot?.study_history, candidateRoot?.work_experience);

    const candidateFields = normalizeToArray(vector.fields_wish).map(String);
    const jobFields = normalizeJobFields(job?.fields);
    const sharedFields = candidateFields.filter((f) => jobFields.includes(f));
    const trainingFields = normalizeToArray(vector.training_fields);
    const trainingMatches = trainingFields.filter((f) => jobFields.includes(f));

    let score = sharedFields.length * 2;

    if (vector.highest_degree_level) {
        score += degreeWeights[vector.highest_degree_level] || 0;
    }

    const experienceYears = vector.total_experience_years || 0;
    score += Math.min(experienceYears, 10) * 0.3; // cap benefit from experience to avoid skew

    if (candidateRoot?.graduation_rank && job?.graduation_rank && candidateRoot.graduation_rank === job.graduation_rank) score += 1;
    if (candidateRoot?.computer_skill && job?.computer_skill && candidateRoot.computer_skill === job.computer_skill) score += 1;
    if (candidateRoot?.job_type && job?.job_type && candidateRoot.job_type === job.job_type) score += 0.5;
    if (candidateRoot?.working_time && job?.working_time && candidateRoot.working_time === job.working_time) score += 0.5;

    const jobLanguages = normalizeToArray(job?.languguages).map((l) => l?.toLowerCase?.() || l);
    const candidateLanguages = normalizeToArray(vector.languages).map((l) => l?.toLowerCase?.() || l);
    const sharedLanguages = candidateLanguages.filter((lang) => jobLanguages.includes(lang));
    if (sharedLanguages.length) {
        score += 0.5 + 0.25 * (sharedLanguages.length - 1);
    }

    if (trainingMatches.length) {
        score += 0.5 + 0.25 * (trainingMatches.length - 1);
    }

    if (vector.trained_at_center) score += 0.5;

    return Number(score.toFixed(2));
};

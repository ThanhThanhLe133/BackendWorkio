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
            return trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
    }

    return [value];
};

export const calculateMatchScore = (jobPost, candidate) => {
    const job = jobPost?.toJSON ? jobPost.toJSON() : jobPost;
    const candidateRoot = candidate?.candidate ?? candidate;

    const candidateFields = normalizeToArray(candidateRoot?.fields_wish).map(String);
    const jobFields = normalizeToArray(job?.fields).map(String);

    const fieldMatches = candidateFields.filter(f => jobFields.includes(f));
    let score = fieldMatches.length * 2;

    if (candidateRoot?.graduation_rank && job?.graduation_rank && candidateRoot.graduation_rank === job.graduation_rank) score += 1;
    if (candidateRoot?.computer_skill && job?.computer_skill && candidateRoot.computer_skill === job.computer_skill) score += 1;
    if (candidateRoot?.job_type && job?.job_type && candidateRoot.job_type === job.job_type) score += 1;
    if (candidateRoot?.working_time && job?.working_time && candidateRoot.working_time === job.working_time) score += 1;

    return score;
};


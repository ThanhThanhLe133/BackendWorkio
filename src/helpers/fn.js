import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const calculateMatchScore = (jobPost, candidate) => {
    let totalScore = 0;

    //Trọng số cho từng tiêu chí
    const WEIGHTS = {
        FIELD_MATCH: 5,
        GRADUATION_MATCH: 4,
        COMPUTER_SKILL_MATCH: 4,
        SALARY_MATCH: 3,
        DURATION_MATCH: 2,
    };

    // So khớp lĩnh vực (fields)
    const jobFields = jobPost.fields || [];
    const candidateFields = candidate.fields || [];
    const hasMatchingField =
        Array.isArray(jobFields) &&
        Array.isArray(candidateFields) &&
        candidateFields.some(field => jobFields.includes(field));

    if (hasMatchingField) {
        totalScore += WEIGHTS.FIELD_MATCH;
    }

    // Trình độ học vấn
    const hasMatchingGraduation =
        jobPost.graduation_rank &&
        candidate.graduation_rank &&
        jobPost.graduation_rank === candidate.graduation_rank;

    if (hasMatchingGraduation) {
        totalScore += WEIGHTS.GRADUATION_MATCH;
    }

    // Kỹ năng tin học
    const hasMatchingComputerSkill =
        jobPost.computer_skill &&
        candidate.computer_skill &&
        jobPost.computer_skill === candidate.computer_skill;

    if (hasMatchingComputerSkill) {
        totalScore += WEIGHTS.COMPUTER_SKILL_MATCH;
    }

    // Lương mong muốn (job >= candidate expected)
    const salaryIsAcceptable =
        jobPost.monthly_salary &&
        candidate.expected_salary &&
        Number(jobPost.monthly_salary) >= Number(candidate.expected_salary);

    if (salaryIsAcceptable) {
        totalScore += WEIGHTS.SALARY_MATCH;
    }

    // 5Thời lượng làm việc 
    const hasMatchingDuration =
        jobPost.duration &&
        candidate.preferred_duration &&
        jobPost.duration === candidate.preferred_duration;

    if (hasMatchingDuration) {
        totalScore += WEIGHTS.DURATION_MATCH;
    }

    return totalScore;
};

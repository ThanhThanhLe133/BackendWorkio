const DEGREE_LEVELS = [
    "Primary",
    "Secondary",
    "HighSchool",
    "Vocational",
    "Associate",
    "Bachelor",
    "Master",
    "Doctorate",
    "Certificate",
    "Custom",
];

const DEGREE_LEVEL_ORDER = {
    Primary: 1,
    Secondary: 2,
    HighSchool: 3,
    Vocational: 4,
    Associate: 5,
    Bachelor: 6,
    Master: 7,
    Doctorate: 8,
    Certificate: 4,
    Custom: 0,
};

const degreeAliases = {
    "cấp 2": "Secondary",
    "cấp 3": "HighSchool",
    thpt: "HighSchool",
    vocational: "Vocational",
    "cao đẳng": "Associate",
    associate: "Associate",
    bachelor: "Bachelor",
    "đại học": "Bachelor",
    "cử nhân": "Bachelor",
    master: "Master",
    "thạc sĩ": "Master",
    doctor: "Doctorate",
    phd: "Doctorate",
};

const toNullableValue = (value) => (value === undefined ? null : value);

const normalizeToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string")
        return value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
    return [value];
};

const normalizeDate = (value) => {
    if (!value) return null;
    const asDate = new Date(value);
    return Number.isNaN(asDate.getTime())
        ? null
        : asDate.toISOString().slice(0, 10);
};

export const normalizeDegreeLevel = (input) => {
    if (!input) return null;
    const normalized = String(input).trim();
    const exactMatch = DEGREE_LEVELS.find(
        (level) => level.toLowerCase() === normalized.toLowerCase(),
    );
    if (exactMatch) return exactMatch;

    const aliasKey = normalized.toLowerCase();
    if (degreeAliases[aliasKey]) return degreeAliases[aliasKey];

    return "Custom";
};

export const normalizeStudyHistories = (entries = []) => {
    if (!Array.isArray(entries)) return [];
    return entries
        .map((entry = {}) => {
            const degree_level = normalizeDegreeLevel(
                entry.degree_level || entry.degree,
            );
            const customDegreeTitle =
                degree_level === "Custom"
                    ? toNullableValue(entry.custom_degree_title || entry.degree)
                    : null;

            return {
                school_name: toNullableValue(entry.school_name),
                degree_level,
                custom_degree_title: customDegreeTitle,
                degree: toNullableValue(entry.degree),
                field_of_study: toNullableValue(entry.field_of_study),
                start_date: normalizeDate(entry.start_date),
                end_date: normalizeDate(entry.end_date),
            };
        })
        .filter(
            (entry) =>
                entry.school_name ||
                entry.degree_level ||
                entry.custom_degree_title ||
                entry.field_of_study ||
                entry.start_date ||
                entry.end_date,
        );
};

export const normalizeWorkExperiences = (entries = []) => {
    if (!Array.isArray(entries)) return [];
    return entries
        .map((entry = {}) => ({
            company_name: toNullableValue(entry.company_name),
            position: toNullableValue(entry.position),
            start_date: normalizeDate(entry.start_date),
            end_date: normalizeDate(entry.end_date),
            description: toNullableValue(entry.description),
        }))
        .filter(
            (entry) =>
                entry.company_name ||
                entry.position ||
                entry.start_date ||
                entry.end_date ||
                entry.description,
        );
};

export const validateStructuredCv = (cvPayload = {}) => {
    if (!cvPayload || typeof cvPayload !== "object") {
        throw new Error("CV must be provided as a structured object");
    }

    const {
        personal_information = {},
        education = [],
        experience = [],
        skills = [],
    } = cvPayload;

    if (!Array.isArray(education) || !Array.isArray(experience)) {
        throw new Error(
            "CV must follow standardized structure: education[] and experience[] are required arrays",
        );
    }

    return {
        personal_information,
        education,
        experience,
        skills: normalizeToArray(skills),
    };
};

export const normalizeCvPayload = (cvPayload) => {
    const { personal_information, education, experience, skills } =
        validateStructuredCv(cvPayload);
    const studyHistories = normalizeStudyHistories(education);
    const workExperiences = normalizeWorkExperiences(experience);

    const candidateInfo = {
        full_name: personal_information.full_name,
        phone: personal_information.phone,
        email: personal_information.email,
        languages:
            personal_information.languages || personal_information.languguages,
        fields_wish: personal_information.fields_wish,
    };

    const cvProfile = {
        personal_information: candidateInfo,
        education: studyHistories,
        experience: workExperiences,
        skills,
    };

    return {
        candidateInfo,
        studyHistories,
        workExperiences,
        cvProfile,
    };
};

const diffInMonths = (start, end) => {
    if (!start) return 0;
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))
        return 0;
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    return Math.max(0, years * 12 + months);
};

const resolveHighestDegree = (studyHistories = []) => {
    let highest = null;
    let highestOrder = -1;
    studyHistories.forEach((entry = {}) => {
        const degreeLevel = normalizeDegreeLevel(
            entry.degree_level || entry.degree,
        );
        const order = DEGREE_LEVEL_ORDER[degreeLevel] ?? -1;
        if (order > highestOrder) {
            highest = degreeLevel;
            highestOrder = order;
        }
    });
    return highest;
};

export const buildMatchingVector = (
    candidate,
    studyHistories = [],
    workExperiences = [],
    trainingHistory = [],
) => {
    const candidateData = candidate?.candidate ?? candidate ?? {};
    const education = studyHistories.map((item) =>
        item.toJSON ? item.toJSON() : item,
    );
    const experiences = workExperiences.map((item) =>
        item.toJSON ? item.toJSON() : item,
    );
    const training = trainingHistory.map((item) =>
        item.toJSON ? item.toJSON() : item,
    );

    const highest_degree_level = resolveHighestDegree(education);
    const total_experience_months = experiences.reduce(
        (total, entry) => total + diffInMonths(entry.start_date, entry.end_date),
        0,
    );

    return {
        fields_wish: normalizeToArray(candidateData.fields_wish).map(String),
        languages: normalizeToArray(candidateData.languages),
        highest_degree_level,
        degree_levels: education
            .map((entry) => normalizeDegreeLevel(entry.degree_level || entry.degree))
            .filter(Boolean),
        custom_degrees: education
            .filter(
                (entry) =>
                    (entry.degree_level || entry.degree) &&
                    normalizeDegreeLevel(entry.degree_level || entry.degree) === "Custom",
            )
            .map((entry) => entry.custom_degree_title || entry.degree)
            .filter(Boolean),
        total_experience_months,
        total_experience_years: Number((total_experience_months / 12).toFixed(1)),
        graduation_rank: candidateData.graduation_rank || null,
        computer_skill: candidateData.computer_skill || null,
        job_type: candidateData.job_type || null,
        working_time: candidateData.working_time || null,
        minimum_income: candidateData.minimum_income || null,
        trained_at_center: training.length > 0,
        training_fields: training
            .map((course) => course.training_field)
            .filter(Boolean),
    };
};

export { DEGREE_LEVELS };

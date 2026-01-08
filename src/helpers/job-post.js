import { Op } from 'sequelize';

export const normalizeSalary = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const numeric = Number(String(value).replace(/,/g, ''));
    if (!Number.isFinite(numeric)) return null;
    return Number(Number(numeric).toFixed(2));
};

export const formatSalary = (value) => {
    const numeric = normalizeSalary(value);
    if (numeric === null) return null;
    return numeric.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const normalizeRequirements = (input) => {
    if (!input) return null;
    if (Array.isArray(input)) {
        return input
            .map((item) => String(item).trim())
            .filter(Boolean)
            .join(' | ')
            .slice(0, 500);
    }
    if (typeof input === 'object') {
        const values = Object.values(input).flat();
        return values
            .map((item) => String(item).trim())
            .filter(Boolean)
            .join(' | ')
            .slice(0, 500);
    }
    return String(input).trim().slice(0, 500);
};

export const extractRequirementAttributes = (requirements) => {
    if (!requirements) return [];
    if (Array.isArray(requirements)) return requirements.map((item) => String(item).trim()).filter(Boolean);
    const asString = String(requirements);
    return asString.split('|').map((item) => item.trim()).filter(Boolean);
};

export const normalizeFieldsFilter = (fields) => {
    if (!fields) return [];
    if (typeof fields === 'string') {
        return fields
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean);
    }
    if (Array.isArray(fields)) {
        return fields
            .flatMap((field) => {
                if (!field) return [];
                if (typeof field === 'object' && field.industry) {
                    return Array.isArray(field.industry) ? field.industry : [field.industry];
                }
                return field;
            })
            .map((f) => String(f).trim())
            .filter(Boolean);
    }
    return [];
};

export const buildJobPostSalaryWhere = ({ min_salary, max_salary }) => {
    const salaryWhere = {};
    const min = normalizeSalary(min_salary);
    const max = normalizeSalary(max_salary);
    if (min !== null) salaryWhere[Op.gte] = min;
    if (max !== null) salaryWhere[Op.lte] = max;
    return salaryWhere;
};

export const formatJobPostResponse = (jobPost) => {
    if (!jobPost) return jobPost;
    const json = jobPost.toJSON ? jobPost.toJSON() : jobPost;
    const monthly_salary_numeric = normalizeSalary(json.monthly_salary);
    return {
        ...json,
        monthly_salary_numeric,
        monthly_salary_display: formatSalary(monthly_salary_numeric),
        requirements_attributes: extractRequirementAttributes(json.requirements),
    };
};

export const formatJobPostList = (list = []) => list.map(formatJobPostResponse);

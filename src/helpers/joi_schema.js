import joi from 'joi'

export const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
export const password = joi.string()
    .min(6)
    .required()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        'any.required': 'Password is required.',
    });
export const dateOfBirth = joi.date().iso();

export const gender = joi.string().valid('Male', 'Female', 'Other');

export const image = joi.string().required()
export const filename = joi.array().required()

export const recruiterEditProfileSchema = joi.object({
    // User model
    name: joi.string().optional(),
    avatar_url: joi.string().uri().optional(),

    // Recruiter model
    company_name: joi.string().optional(),
    description: joi.string().max(2000).optional(),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
    website: joi.string().uri().optional(),
    established_at: joi.date().iso().optional(),

    // Các trường từ Address model
    province_code: joi.string().optional(),
    ward_code: joi.string().optional(),
    street: joi.string().optional(),
});

export const candidateEditProfileSchema = joi.object({
    // Từ User model
    name: joi.string().optional(),
    avatar_url: joi.string().uri().optional(),

    // Candidate model
    resume_url: joi.string().uri().optional(),
    gender: gender.optional(),
    dob: dateOfBirth.optional()
});
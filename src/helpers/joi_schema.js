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

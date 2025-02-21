import Joi from 'joi';

//Validation schema for user login
export const loginValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(5)
        .max(15)
        .required(),
    password: Joi.string()
        .min(7)
        .pattern(new RegExp('(?=.*?[#?!@$ %^&*-])(?=.*?[0-9])'))
        .required()
});

//Validation schema for user registration (sign up)
export const registerValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(5)
        .max(15)
        .required().messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be an empty field',
            'string.min': 'Username must be at least 5 characters long',
            'string.max': 'Username must not exceed 15 characters',
            'any.required': 'Username is a required field'
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required().messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email cannot be an empty field',
            'string.email': 'Email must be a valid email',
            'any.required': 'Email is a required field'
        }),
    
    password: Joi.string()
        .min(7)
        .pattern(new RegExp('(?=.*?[#?!@$ %^&*-])(?=.*?[0-9])'))
        .required().messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password cannot be an empty field',
            'string.min': 'Password must be at least 7 characters long',
            'string.pattern.base': 'Password must contain at least one special character and one number',
            'any.required': 'Password is a required field'
        })
});
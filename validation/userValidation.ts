import Joi from 'joi';

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

import Joi from 'joi';

export const ingredientStringSchema = Joi
    .string()
    .required()
    .messages({
        'string.base': 'Required',
        'string.empty': 'Required',
        'any.required': 'Required'
    });

export const ingredientNumberSchema = Joi
    .number()
    .required()
    .positive()
    .messages({
        'number.base': 'Must be Positive',
        'number.empty': 'Required',
        'number.min': 'Must be Positive',
        'number.positive': 'Must be Positive',
        'any.required': 'Required'
    });

export const ingredientQuantityAndUnitSchema = Joi
    .object({
        quantity: Joi
            .number()
            .positive(),
        unit: Joi
            .string()
            .min(1)
    })
    
export const ingredientSchema = Joi
    .object({
        name: Joi
            .string()
            .required(),
        quantityUnit: Joi
            .string()
            .required(),
        quantity: Joi
            .number()
            .required()
            .positive(),
        form: Joi
            .string()
            .required()
    })
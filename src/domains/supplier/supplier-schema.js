import Joi from 'joi';

export const supplierSchema = Joi.object({
    id : Joi.string().guid().optional().messages({
        'string.base': 'Id must be string',
        'string.guid': 'Id must be guid',
    }),
    name: Joi.string().required().max(150).messages({
        'string.max': 'Name must be max 150 character',
    }),

    contact: Joi.string().required().max(12).messages({
        'string.max': 'Contact must be max 12 character',
    }),

    type : Joi.string().required().valid('SYRUPE', 'BEANS', 'POWDER', 'CUP', 'SNACK', 'OTHER INGREDIENT').required().messages({
        'any.only': 'Type must be SYRUPE, BEANS, POWDER, CUP, SNACK, OTHER INGREDIENT',
    }),

    productName : Joi.string().required().max(150).messages({
        'string.max': 'Product Name must be max 150 character',
    }),

    price : Joi.number().min(0).required().messages({
        'number.base': 'Price must be number',
        'number.min': 'Price must be greater than 0',
    }),

    shippingFee : Joi.number().min(0).required().messages({
        'number.base': 'Shipping Fee must be number',
        'number.min': 'Shipping Fee must be greater than 0',
    }),

    address : Joi.string().required().max(150).messages({
        'string.max': 'Address must be max 150 character',
    }),

    unit : Joi.string().required().valid('KG', 'LITER', 'GRAM', 'ML', 'PIECE', 'BOX', 'BALL').required().messages({
        'any.only': 'Unit must be KG, LITER, GRAM, ML, PIECE, BOX, BALL',
    }),

    isActive : Joi.boolean().required().messages({
        'boolean.base': 'Is Active must be boolean',
    }),
});
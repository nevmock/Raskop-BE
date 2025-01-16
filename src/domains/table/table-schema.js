import Joi from 'joi';

export const tableSchema = Joi.object({
    id: Joi.string().guid().optional().messages({
            'string.base': 'Id must be string',
            'string.guid': 'Id must be guid',
    }),
    minCapacity: Joi.number().min(0).required().messages({
        'number.base': 'Min capacity must be number',
        'number.min': 'Min capacity must be greater than 0',
    }),
    maxCapacity: Joi.number().min(0).required().messages({
        'number.base': 'Max capacity must be number',
        'number.min': 'Max capacity must be greater than 0',
    }),
    description: Joi.string().optional().max(1500).messages({
        'string.max': 'Description must be max 1500 character',
    }),
    noTable: Joi.string().min(0).required().messages({
        'number.base': 'No table must be number',
        'number.min': 'No table must be greater than 0',
    }),
    isOutdoor: Joi.boolean().optional().messages({
        'boolean.base': 'Is outdoor must be boolean',
    }),
    barcode: Joi.string().optional().messages({
        'string.base': 'Barcode must be string',
    }),
    isActive: Joi.boolean().optional().messages({
        'boolean.base': 'Is active must be boolean',
    }),
});
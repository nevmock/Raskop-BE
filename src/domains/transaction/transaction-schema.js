import Joi from 'joi';

const transactionSchema = Joi.object({
    orderId: Joi.string().guid().optional().messages({
            'string.base': 'Id must be string',
            'string.guid': 'Id must be guid',
    }),
    paymentMethod: Joi.string().valid('bank_transfer', 'other_qris').required(),
});

export { transactionSchema };


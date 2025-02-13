import Joi from "joi";
const orderSchema = Joi.object({
  orderBy: Joi.string().required().min(3).max(150).messages({
    "string.min": "Order By must be min 3 character",
    "string.max": "Order By must be max 150 character",
  }),

  phoneNumber: Joi.string().required().min(3).max(12).messages({
    "string.min": "Phone Number must be min 3 character",
    "string.max": "Phone Number must be max 12 character",
  }),

  menus: Joi.array().items(
    Joi.object({
        id: Joi.string().guid().required(),
        quantity: Joi.number().integer().min(1).required(),
        note: Joi.string().optional().max(1500),
    })).required().min(1).messages({
        'array.min': 'Menus must be min 1 item',
    }),

  paymentMethod: Joi.string().valid('bank_transfer', 'other_qris').required(),
});

const updateStatusOrderSchema = Joi.object({
    id: Joi.string().guid().required(),
    status: Joi.string().valid('PROSES', 'SELESAI_DIBUAT').required(),
});

export { orderSchema, updateStatusOrderSchema };
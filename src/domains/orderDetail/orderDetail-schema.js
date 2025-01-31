import Joi from "joi";

export const orderDetailSchema = Joi.object({
  order_id: Joi.string().guid().required(),
  menu_id: Joi.string().guid().required(),
  qty: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required(),
  note: Joi.string().allow(null, "").max(255),
});

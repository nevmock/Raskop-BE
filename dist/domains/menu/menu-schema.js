import Joi from "joi";
export const menuSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    "string.base": "Id must be string",
    "string.guid": "Id must be guid"
  }),
  name: Joi.string().required().min(3).max(150).messages({
    "string.min": "Name must be min 3 character",
    "string.max": "Name must be max 150 character"
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be number",
    "number.min": "Price must be greater than 0"
  }),
  description: Joi.string().required().min(3).max(150).messages({
    "string.min": "Description must be min 3 character",
    "string.max": "Description must be max 150 character"
  }),
  category: Joi.string().required().min(3).max(150).messages({
    "string.min": "Category must be min 3 character",
    "string.max": "Category must be max 150 character"
  }),
  qty: Joi.number().min(0).required().messages({
    "number.base": "Qty must be number",
    "number.min": "Qty must be greater than 0"
  }),
  isActive: Joi.boolean().required().messages({
    "boolean.base": "Is Active must be boolean"
  })
});
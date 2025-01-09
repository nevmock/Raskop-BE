import Joi from "joi";

export const menuSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    "string.base": "Id must be string",
    "string.guid": "Id must be guid",
  }),
  name: Joi.string().required().min(3).max(150).messages({
    "string.min": "Name must be min 3 character",
    "string.max": "Name must be max 150 character",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be number",
    "number.min": "Price must be greater than 0",
  }),

  description: Joi.string().required().min(3).max(150).messages({
    "string.min": "Description must be min 3 character",
    "string.max": "Description must be max 150 character",
  }),

  category: Joi.string().required().min(3).max(150).messages({
    "string.min": "Category must be min 3 character",
    "string.max": "Category must be max 150 character",
  }),

  image: Joi.object({
    fieldname: Joi.string().valid("image").required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
    buffer: Joi.binary().required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required(),
  })
    .required()
    .messages({
      "object.base": "Image must be an object",
      "object.unknown": "Image contains unknown fields",
      "any.required": "Image is required",
      "string.valid": "Image must be a valid image file (jpeg, png, gif)",
      "binary.base": "Image must be a valid binary file",
      "number.max": "Image size must be less than 5MB",
    }),

  qty: Joi.number().min(0).required().messages({
    "number.base": "Qty must be number",
    "number.min": "Qty must be greater than 0",
  }),

  isActive: Joi.boolean().required().messages({
    "boolean.base": "Is Active must be boolean",
  }),
});

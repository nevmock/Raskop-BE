import Joi from "joi";

export const orderSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    "string.base": "Id must be string",
    "string.guid": "Id must be guid",
  }),

  orderBy: Joi.string().required().min(3).max(150).messages({
    "string.min": "Order By must be min 3 character",
    "string.max": "Order By must be max 150 character",
  }),

  phoneNumber: Joi.string().required().min(3).max(12).messages({
    "string.min": "Phone Number must be min 3 character",
    "string.max": "Phone Number must be max 12 character",
  }),

  reservationId: Joi.string().guid().optional().messages({
    "string.base": "Reservation Id must be string",
    "string.guid": "Reservation Id must be guid",
  }),
});

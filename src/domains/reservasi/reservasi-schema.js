import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const reservasiSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    "string.base": "Id must be string",
    "string.guid": "Id must be guid",
  }),
  reserveBy: Joi.string().required().min(3).max(150).messages({
    "string.min": "Reserve By must be min 3 character",
    "string.max": "Reserve By must be max 150 character",
  }),

  community: Joi.string().required().min(1).max(150).messages({
    "string.min": "community must be min 1 character",
    "string.max": "community must be max 150 character",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+62\d{9,13}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must start with +62 and be between 10 to 15 digits long",
      "string.empty": "Phone number is required",
  }),

  note: Joi.string().optional().max(1500).messages({
    "string.max": "Note must be max 1500 character",
  }),

  start: Joi.date().format("YYYY-MM-DD HH:mm").required().messages({
    "date.base": "Start must be date",
  }),

  end: Joi.date().format("YYYY-MM-DD HH:mm").greater(Joi.ref("start")).required().messages({
    "date.base": "End must be date",
  }),

  tables: Joi.array().items(Joi.string().guid()).required().min(1).messages({
    "array.min": "Tables must be min 1 item",
  }),

  menus: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().guid().required(),
        quantity: Joi.number().integer().min(1).required(),
        note: Joi.string().optional().max(1500),
      })
    )
    .required()
    .min(1)
    .messages({
      "array.min": "Menus must be min 1 item",
    }),
  paymentMethod: Joi.string().valid("bank_transfer", "other_qris").required(),
  halfPayment: Joi.boolean().required(),
});

const updateStatusReservasiSchema = Joi.object({
  id: Joi.string().guid().required(),
  status: Joi.string().valid("PROSES", "SELESAI_DIBUAT").required(),
});

const cancelReservasiSchema = Joi.object({
  id: Joi.string().guid().required(),
});

export { reservasiSchema, updateStatusReservasiSchema, cancelReservasiSchema };

import Joi from "joi";

export const OrderStatus = {
  MENUNGGU_PEMBAYARAN: "MENUNGGU_PEMBAYARAN",
  MENUNGGU_PELUNASAN: "MENUNGGU_PELUNASAN",
  BELUM_DIBUAT: "BELUM_DIBUAT",
  PROSES: "PROSES",
  SELESAI_DIBUAT: "SELESAI_DIBUAT",
  CANCELED: "CANCELED",
};

export const orderSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    "string.base": "Id must be string",
    "string.guid": "Id must be guid",
  }),

  orderBy: Joi.string().optional().min(3).max(150).messages({
    "string.min": "Order By must be min 3 character",
    "string.max": "Order By must be max 150 character",
  }),

  phoneNumber: Joi.string().optional().min(3).max(12).messages({
    "string.min": "Phone Number must be min 3 character",
    "string.max": "Phone Number must be max 12 character",
  }),

  reservationId: Joi.string().guid().optional().messages({
    "string.base": "Reservation Id must be string",
    "string.guid": "Reservation Id must be guid",
  }),

  status: Joi.string()
    .valid(
      OrderStatus.MENUNGGU_PEMBAYARAN,
      OrderStatus.MENUNGGU_PELUNASAN,
      OrderStatus.BELUM_DIBUAT,
      OrderStatus.PROSES,
      OrderStatus.SELESAI_DIBUAT,
      OrderStatus.CANCELED
    )
    .optional()
    .messages({
      "string.valid":
        "Status must be one of the following: MENUNGGU_PEMBAYARAN, MENUNGGU_PELUNASAN, BELUM_DIBUAT, PROSES, SELESAI_DIBUAT, CANCELED",
    }),
});

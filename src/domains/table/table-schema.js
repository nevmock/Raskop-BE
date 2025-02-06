import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

export const tableSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    "string.base": "Id must be string",
    "string.guid": "Id must be guid",
  }),
  minCapacity: Joi.number().integer().min(0).required().messages({
    "number.base": "Min capacity must be number",
    "number.min": "Min capacity must be greater than 0",
  }),
  maxCapacity: Joi.number().min(0).greater(Joi.ref("minCapacity")).required().messages({
    "number.base": "Max capacity must be number",
    "number.min": "Max capacity must be greater than 0",
  }),
  description: Joi.string().optional().max(1500).messages({
    "string.max": "Description must be max 1500 character",
  }),
  noTable: Joi.string().min(0).required().messages({
    "number.base": "No table must be number",
    "number.min": "No table must be greater than 0",
  }),
  isOutdoor: Joi.boolean().optional().messages({
    "boolean.base": "Is outdoor must be boolean",
  }),
  barcode: Joi.string().optional().messages({
    "string.base": "Barcode must be string",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Is active must be boolean",
  }),
  mergedAvailable: Joi.array()
    .items(Joi.string().guid())
    .optional()
    .custom((value, helpers) => {
      const id = helpers.state.ancestors[0].id;
      if (id && value.includes(id)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "array.base": "Merged available must be an array",
      "array.items": "Each item in merged available must be a valid UUID",
      "any.invalid": "Merged available cannot include its own ID",
    }),
});

export const tableSuggestionSchema = Joi.object({
  capacity: Joi.number().integer().min(1).required().messages({
    "number.base": "Capacity must be a number",
    "number.min": "Capacity must be greater than 0",
  }),
  isOutdoor: Joi.boolean().required().messages({
    "boolean.base": "Is outdoor must be boolean",
  }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date",
    "date.empty": "Date is required",
  }),
  startTime: Joi.date().format("HH:mm:ss").required().messages({
    "date.base": "Start time must be a valid date",
    "date.empty": "Start time is required",
  }),
  endTime: Joi.date().format("HH:mm:ss").greater(Joi.ref("startTime")).required().messages({
    "date.base": "End time must be a valid date",
    "date.empty": "End time is required",
    "date.greater": "End time must be greater than start time",
  }),
});

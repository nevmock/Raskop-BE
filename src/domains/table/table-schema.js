import JoiBase from "joi";
import JoiDate from "@joi/date";
import moment from "moment";

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
  capacity: Joi.number().integer().min(10).required().messages({
    "number.base": "Capacity must be a number",
    "number.min": "Capacity must be at least 10 person",
  }),
  isOutdoor: Joi.boolean().required().messages({
    "boolean.base": "Is outdoor must be boolean",
  }),
  startTime: Joi.date().format("YYYY-MM-DD HH:mm").min(new Date()).required().messages({
    "date.base": "Start must be a date",
    "date.min": "Start must be at least the current time",
  }),

  endTime: Joi.date().format("YYYY-MM-DD HH:mm")
    .greater(Joi.ref("startTime"))
    .required()
    .custom((value, helpers) => {
      const start = helpers.state.ancestors[0].startTime; // Get the start value
      const diffHours = (new Date(value) - new Date(start)) / (1000 * 60 * 60); // Convert diff to hours
      
      if (diffHours !== 4) {
        return helpers.error("date.exactDiff", { message: "EndTime must be exactly 4 hours after start" });
      }
      return value;
    })
    .messages({
      "date.base": "End must be a date",
      "date.greater": "End must be greater than start",
      "date.exactDiff": "End must be exactly 4 hours after start",
  }),
});

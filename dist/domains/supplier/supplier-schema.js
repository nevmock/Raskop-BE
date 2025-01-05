"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supplierSchema = void 0;
var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var supplierSchema = exports.supplierSchema = _joi["default"].object({
  id: _joi["default"].string().guid().optional().messages({
    'string.base': 'Id must be string',
    'string.guid': 'Id must be guid'
  }),
  name: _joi["default"].string().required().min(3).max(150).messages({
    'string.min': 'Name must be min 3 character',
    'string.max': 'Name must be max 150 character'
  }),
  contact: _joi["default"].string().required().min(3).max(12).messages({
    'string.min': 'Name must be min 3 character',
    'string.max': 'Contact must be max 12 character'
  }),
  type: _joi["default"].string().required().valid('SYRUPE', 'BEANS', 'POWDER', 'CUP', 'SNACK', 'OTHER INGREDIENT').required().messages({
    'any.only': 'Type must be SYRUPE, BEANS, POWDER, CUP, SNACK, OTHER INGREDIENT'
  }),
  productName: _joi["default"].string().required().max(150).messages({
    'string.max': 'Product Name must be max 150 character'
  }),
  price: _joi["default"].number().min(0).required().messages({
    'number.base': 'Price must be number',
    'number.min': 'Price must be greater than 0'
  }),
  shippingFee: _joi["default"].number().min(0).required().messages({
    'number.base': 'Shipping Fee must be number',
    'number.min': 'Shipping Fee must be greater than 0'
  }),
  address: _joi["default"].string().required().max(150).messages({
    'string.max': 'Address must be max 150 character'
  }),
  unit: _joi["default"].string().required().valid('KG', 'LITER', 'GRAM', 'ML', 'PIECE', 'BOX', 'BALL').required().messages({
    'any.only': 'Unit must be KG, LITER, GRAM, ML, PIECE, BOX, BALL'
  }),
  isActive: _joi["default"]["boolean"]().required().messages({
    'boolean.base': 'Is Active must be boolean'
  })
});

// export const supplierParamsGetSchema = Joi.object({
//     id : Joi.string().guid().optional().messages({
//         'string.base': 'Id must be string',
//         'string.guid': 'Id must be guid',
//     }),
//     search : Joi.string().optional().messages({
//         'string.base': 'Search must be string',
//     }),
//     createdStart : Joi.date().optional().messages({
//         'date.base': 'Created Start must be date',
//     }),
//     createdEnd : Joi.date().optional()..messages({
//         'date.base': 'Created End must be date',
//     }),
//     withDeleted : Joi.boolean().optional().messages({
//         'boolean.base': 'With Deleted must be boolean',
//     }),
//     page : Joi.number().optional().messages({
//         'number.base': 'Page must be number',
//     }),
//     limit : Joi.number().optional().messages({
//         'number.base': 'Limit must be number',
//     }),
//     sortBy : Joi.string().optional().messages({
//         'string.base': 'Sort By must be string',
//     }),
//     sortType : Joi.string().optional().valid('ASC', 'DESC').messages({
//         'any.only': 'Sort Type must be ASC or DESC',
//     }),
// });
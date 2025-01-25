import JoiBase from 'joi';
import JoiDate from '@joi/date';
const Joi = JoiBase.extend(JoiDate);
export const reservasiSchema = Joi.object({
  id: Joi.string().guid().optional().messages({
    'string.base': 'Id must be string',
    'string.guid': 'Id must be guid'
  }),
  reserveBy: Joi.string().required().min(3).max(150).messages({
    'string.min': 'Reserve By must be min 3 character',
    'string.max': 'Reserve By must be max 150 character'
  }),
  community: Joi.string().required().min(3).max(150).messages({
    'string.min': 'community must be min 3 character',
    'string.max': 'community must be max 150 character'
  }),
  phoneNumber: Joi.string().required().min(3).max(12).messages({
    'string.min': 'Phone Number must be min 3 character',
    'string.max': 'Phone Number must be max 12 character'
  }),
  note: Joi.string().optional().max(1500).messages({
    'string.max': 'Note must be max 1500 character'
  }),
  start: Joi.date().format('YYYY-MM-DD HH:mm').required().messages({
    'date.base': 'Start must be date'
  }),
  end: Joi.date().format('YYYY-MM-DD HH:mm').greater(Joi.ref('start')).required().messages({
    'date.base': 'End must be date'
  })
});
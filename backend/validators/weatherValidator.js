const Joi = require('joi');

const weatherQuerySchema = Joi.object({
  type: Joi.string().valid('city', 'zip', 'coordinates').required(),
  value: Joi.string().when('type', {
    is: Joi.string().valid('city', 'zip'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  lat: Joi.number().when('type', {
    is: 'coordinates',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  lon: Joi.number().when('type', {
    is: 'coordinates',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const dateRangeSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
});

const createWeatherRecordSchema = Joi.object({
  location: Joi.object({
    type: Joi.string().valid('city', 'zip', 'coordinates').required(),
    value: Joi.string().required()
  }).required(),
  dateRange: dateRangeSchema.required()
});

const updateWeatherRecordSchema = Joi.object({
  location: Joi.object({
    type: Joi.string().valid('city', 'zip', 'coordinates'),
    value: Joi.string()
  }).optional(),
  dateRange: dateRangeSchema.optional()
}).min(1);

module.exports = {
  weatherQuerySchema,
  createWeatherRecordSchema,
  updateWeatherRecordSchema
};

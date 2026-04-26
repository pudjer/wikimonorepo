import * as Joi from 'joi'

export const envSchema = Joi.object({
  PORT: Joi.number().port().required(),

  NEO4J_URI: Joi.string().uri().required(),
  NEO4J_USER: Joi.string().required(),
  NEO4J_PASSWORD: Joi.string().required(),
  NEO4J_DATABASE: Joi.string().required(),

  ELASTICSEARCH_NODES: Joi.string().required(),
  ELASTICSEARCH_USERNAME: Joi.string().required(),
  ELASTICSEARCH_PASSWORD: Joi.string().required(),

  SESSION_ACTIVE_TIME_MS: Joi.number().integer().positive().required(),
})
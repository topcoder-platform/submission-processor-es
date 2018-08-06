/**
 * Service for submission processor.
 */

const Joi = require('joi')
const logger = require('../common/logger')
const helper = require('../common/helper')
const config = require('config')

const client = helper.getESClient()

/**
 * Create message in Elasticsearch.
 * @param {Object} message the message
 */
function * create (message) {
  yield client.create({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.payload.id,
    body: message.payload
  })
}

create.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().valid('submission', 'review', 'reviewType', 'reviewSummation').required(),
      id: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update message in Elasticsearch.
 * @param {Object} message the message
 */
function * update (message) {
  yield client.update({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.payload.id,
    body: { doc: message.payload }
  })
}

update.schema = create.schema

/**
 * Remove message in Elasticsearch.
 * @param {Object} message the message
 */
function * remove (message) {
  yield client.delete({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.payload.id
  })
}

remove.schema = create.schema

// Exports
module.exports = {
  create,
  update,
  remove
}

logger.buildService(module.exports)

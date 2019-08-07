/**
 * Service for submission processor.
 */

const _ = require('lodash')
const Joi = require('joi')
const logger = require('../common/logger')
const helper = require('../common/helper')
const config = require('config')

const client = helper.getESClient()

/**
 * Get elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} Data from Elastic search
 */
function * getESData (id) {
  return yield client.getSource({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

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

  // Add review / reviewSummation to submission
  if (message.payload.resource === 'review') {
    const submission = yield getESData(message.payload.submissionId)
    let reviewArr = []
    reviewArr.push(_.omit(message.payload, ['resource']))
    if (submission.review) {
      reviewArr = reviewArr.concat(submission.review)
    }
    yield client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: message.payload.submissionId,
      body: { doc: {review: reviewArr} }
    })
  } else if (message.payload.resource === 'reviewSummation') {
    const submission = yield getESData(message.payload.submissionId)
    let reviewSummationArr = []
    reviewSummationArr.push(_.omit(message.payload, ['resource']))
    if (submission.reviewSummation) {
      reviewSummationArr = reviewSummationArr.concat(submission.reviewSummation)
    }
    yield client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: message.payload.submissionId,
      body: { doc: {reviewSummation: reviewSummationArr} }
    })
  }
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

  if (message.payload.resource === 'review') {
    const review = yield getESData(message.payload.id)
    const submission = yield getESData(review.submissionId)
    const reviewToBeUpdated = _.filter(submission.review, {id: message.payload.id})[0]
    _.extend(reviewToBeUpdated, _.omit(message.payload, ['resource']))
    _.remove(submission.review, {id: message.payload.id})
    submission.review.push(reviewToBeUpdated)
    yield client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: {review: submission.review} }
    })
  } else if (message.payload.resource === 'reviewSummation') {
    const reviewSummation = yield getESData(message.payload.id)
    const submission = yield getESData(reviewSummation.submissionId)
    const reviewSummationToBeUpdated = _.filter(submission.reviewSummation, {id: message.payload.id})[0]
    _.extend(reviewSummationToBeUpdated, _.omit(message.payload, ['resource']))
    _.remove(submission.reviewSummation, {id: message.payload.id})
    submission.reviewSummation.push(reviewSummationToBeUpdated)
    yield client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: {reviewSummation: submission.reviewSummation} }
    })
  }
}

update.schema = create.schema

/**
 * Remove message in Elasticsearch.
 * @param {Object} message the message
 */
function * remove (message) {
  // Remove review / reviewSummation from submission data
  if (message.payload.resource === 'review') {
    const review = yield getESData(message.payload.id)
    const submission = yield getESData(review.submissionId)
    _.remove(submission.review, {id: message.payload.id})
    yield client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: {review: submission.review} }
    })
  } else if (message.payload.resource === 'reviewSummation') {
    const reviewSummation = yield getESData(message.payload.id)
    const submission = yield getESData(reviewSummation.submissionId)
    _.remove(submission.reviewSummation, {id: message.payload.id})
    yield client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: {reviewSummation: submission.reviewSummation} }
    })
  }

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

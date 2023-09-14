/**
 * Service for submission processor.
 */

const _ = require('lodash')
const Joi = require('joi')
const logger = require('../common/logger')
const helper = require('../common/helper')
const config = require('config')
const { validate: uuidValidate } = require('uuid')

const client = helper.getESClient()

/**
 * Get elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} Data from Elastic search
 */
async function getESData (id) {
  const result = await client.getSource({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
  return result.body
}

/**
 * Create message in Elasticsearch.
 * @param {Object} message the message
 */
async function create (message) {
  if (message.payload.resource === 'submission') {
    if (message.payload.v5ChallengeId) {
      message.payload.challengeId = message.payload.v5ChallengeId
      delete message.payload.v5ChallengeId
    }
  }

  await client.update({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.payload.id,
    refresh: 'wait_for',
    body: { doc: message.payload, doc_as_upsert: true }
  })

  // Add review / reviewSummation to submission
  if (message.payload.resource === 'review') {
    const submission = await getESData(message.payload.submissionId)
    let reviewArr = []
    reviewArr.push(_.omit(message.payload, ['resource']))
    if (submission.review) {
      reviewArr = reviewArr.concat(submission.review)
    }
    await client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: message.payload.submissionId,
      body: { doc: { review: reviewArr } }
    })
  } else if (message.payload.resource === 'reviewSummation') {
    const submission = await getESData(message.payload.submissionId)
    let reviewSummationArr = []
    reviewSummationArr.push(_.omit(message.payload, ['resource']))
    if (submission.reviewSummation) {
      reviewSummationArr = reviewSummationArr.concat(submission.reviewSummation)
    }
    await client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: message.payload.submissionId,
      body: { doc: { reviewSummation: reviewSummationArr } }
    })
  }
}

create.schema = Joi.object({
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
}).required()

/**
 * Update message in Elasticsearch.
 * @param {Object} message the message
 */
async function update (message) {
  if (message.payload.resource === 'submission') {
    if (message.payload.v5ChallengeId) {
      message.payload.challengeId = message.payload.v5ChallengeId
      if (!uuidValidate(message.payload.challengeId)) {
        message.payload.legacyChallengeId = message.payload.challengeId
      }
      delete message.payload.v5ChallengeId
    }
  }

  await client.update({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id: message.payload.id,
    refresh: 'wait_for',
    body: { doc: message.payload, doc_as_upsert: true }
  })

  if (message.payload.resource === 'review') {
    const review = await getESData(message.payload.id)
    const submission = await getESData(review.submissionId)
    const reviewToBeUpdated = _.filter(submission.review, { id: message.payload.id })[0]
    _.extend(reviewToBeUpdated, _.omit(message.payload, ['resource']))
    _.remove(submission.review, { id: message.payload.id })
    submission.review.push(reviewToBeUpdated)
    await client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: { review: submission.review } }
    })
  } else if (message.payload.resource === 'reviewSummation') {
    const reviewSummation = await getESData(message.payload.id)
    const submission = await getESData(reviewSummation.submissionId)
    const reviewSummationToBeUpdated = _.filter(submission.reviewSummation, { id: message.payload.id })[0]
    _.extend(reviewSummationToBeUpdated, _.omit(message.payload, ['resource']))
    _.remove(submission.reviewSummation, { id: message.payload.id })
    submission.reviewSummation.push(reviewSummationToBeUpdated)
    await client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: { reviewSummation: submission.reviewSummation } }
    })
  }
}

update.schema = create.schema

/**
 * Remove message in Elasticsearch.
 * @param {Object} message the message
 */
async function remove (message) {
  // Remove review / reviewSummation from submission data
  if (message.payload.resource === 'review') {
    const review = await getESData(message.payload.id)
    const submission = await getESData(review.submissionId)
    _.remove(submission.review, { id: message.payload.id })
    await client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: { review: submission.review } }
    })
  } else if (message.payload.resource === 'reviewSummation') {
    const reviewSummation = await getESData(message.payload.id)
    const submission = await getESData(reviewSummation.submissionId)
    _.remove(submission.reviewSummation, { id: message.payload.id })
    await client.update({
      index: config.get('esConfig.ES_INDEX'),
      type: config.get('esConfig.ES_TYPE'),
      id: submission.id,
      body: { doc: { reviewSummation: submission.reviewSummation } }
    })
  }

  await client.delete({
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

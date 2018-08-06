/*
 * Test data to be used in tests
 */

const uuid = require('uuid/v4')

const submissionMessage = {
  topic: 'submission.notification.create',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'submission',
    id: uuid(),
    type: 'ContestSubmission',
    url: 'http://test.com/some/path',
    memberId: uuid(),
    challengeId: uuid(),
    created: '2018-01-01T00:00:00',
    updated: '2018-01-02T00:00:00',
    createdBy: 'admin',
    updatedBy: 'user'
  }
}

const updatedSubmission = {
  topic: 'submission.notification.update',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'submission',
    id: uuid(),
    type: 'ContestSubmission',
    url: 'http://test.com/other',
    memberId: uuid(),
    challengeId: uuid(),
    created: '2018-01-01T00:00:00',
    updated: '2018-01-02T00:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
}

const reviewMessage = {
  topic: 'submission.notification.create',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'review',
    id: uuid(),
    score: 98,
    typeId: uuid(),
    reviewerId: uuid(),
    scoreCardId: uuid(),
    submissionId: uuid(),
    created: '2018-01-01T00:00:00',
    updated: '2018-01-02T00:00:00',
    createdBy: 'admin',
    updatedBy: 'user'
  }
}

const updatedReview = {
  topic: 'submission.notification.update',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'review',
    id: uuid(),
    score: 98,
    typeId: uuid(),
    reviewerId: uuid(),
    scoreCardId: uuid(),
    submissionId: uuid(),
    created: '2018-01-01T00:00:00',
    updated: '2018-01-02T00:00:00',
    createdBy: 'admin',
    updatedBy: 'user'
  }
}

const reviewTypeMessage = {
  topic: 'submission.notification.create',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'reviewType',
    id: uuid(),
    name: 'Iterative Review',
    isActive: true
  }
}

const updatedReviewType = {
  topic: 'submission.notification.update',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'reviewType',
    id: uuid(),
    name: 'Iterative Review',
    isActive: true
  }
}

const reviewSummationMessage = {
  topic: 'submission.notification.create',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'reviewSummation',
    id: uuid(),
    submissionId: uuid(),
    aggregateScore: 88,
    scoreCardId: uuid(),
    isPassing: true,
    created: '2018-01-01T00:00:00',
    updated: '2018-01-02T00:00:00',
    createdBy: 'admin',
    updatedBy: 'user'
  }
}

const updatedReviewSummation = {
  topic: 'submission.notification.update',
  originator: 'submission-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    resource: 'reviewSummation',
    id: uuid(),
    submissionId: uuid(),
    aggregateScore: 88,
    scoreCardId: uuid(),
    isPassing: true,
    created: '2018-01-01T00:00:00',
    updated: '2018-01-02T00:00:00',
    createdBy: 'admin',
    updatedBy: 'user'
  }
}

const existentIds = [submissionMessage.payload.id, updatedSubmission.payload.id,
  reviewMessage.payload.id, updatedReview.payload.id,
  reviewTypeMessage.payload.id, updatedReviewType.payload.id,
  reviewSummationMessage.payload.id, updatedReviewSummation.payload.id]

module.exports = {
  existentIds,
  submissionMessage,
  reviewMessage,
  reviewTypeMessage,
  reviewSummationMessage,
  updatedSubmission,
  updatedReview,
  updatedReviewType,
  updatedReviewSummation
}

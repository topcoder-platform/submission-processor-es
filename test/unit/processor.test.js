/**
 * The test cases for TC submission processor.
 */

const _ = require('lodash')
const expect = require('chai').expect
const ProcessorService = require('../../src/services/ProcessorService')
const uuid = require('uuid/v4')
const co = require('co')
const testHelper = require('../common/testHelper')
const { submissionMessage, reviewMessage,
  reviewTypeMessage, reviewSummationMessage,
  updatedSubmission, updatedReview,
  updatedReviewType, updatedReviewSummation } = require('../common/testData')

describe('TC Submission Processor Tests', () => {
  // test data
  it('create submission message', (done) => {
    co(function * () {
      yield ProcessorService.create(submissionMessage)
      const data = yield testHelper.getESData(submissionMessage.payload.id)
      testHelper.expectObject(data, submissionMessage.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create submission message - already exists', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(409)
        return
      }
      throw new Error('There should be conflict error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update submission message', (done) => {
    co(function * () {
      yield ProcessorService.update(updatedSubmission)
      const data = yield testHelper.getESData(updatedSubmission.payload.id)
      testHelper.expectObject(data, updatedSubmission.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update submission message - not found', (done) => {
    const message = _.cloneDeep(updatedSubmission)
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete submission message', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.topic = 'submission.notification.delete'
    message.payload.id = uuid()
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(message.payload.id)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete submission message - not found', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.topic = 'submission.notification.delete'
    co(function * () {
      try {
        yield ProcessorService.remove(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create review message', (done) => {
    co(function * () {
      yield ProcessorService.create(reviewMessage)
      const data = yield testHelper.getESData(reviewMessage.payload.id)
      testHelper.expectObject(data, reviewMessage.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create review message - already exists', (done) => {
    const message = _.cloneDeep(reviewMessage)
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(409)
        return
      }
      throw new Error('There should be conflict error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update review message', (done) => {
    co(function * () {
      yield ProcessorService.update(updatedReview)
      const data = yield testHelper.getESData(updatedReview.payload.id)
      testHelper.expectObject(data, updatedReview.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update review message - not found', (done) => {
    const message = _.cloneDeep(reviewMessage)
    message.topic = 'submission.notification.update'
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete review message', (done) => {
    const message = _.cloneDeep(reviewMessage)
    message.topic = 'submission.notification.delete'
    message.payload.id = uuid()
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(message.payload.id)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete review message - not found', (done) => {
    const message = _.cloneDeep(reviewMessage)
    message.topic = 'submission.notification.delete'
    co(function * () {
      try {
        yield ProcessorService.remove(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create review type message', (done) => {
    co(function * () {
      yield ProcessorService.create(reviewTypeMessage)
      const data = yield testHelper.getESData(reviewTypeMessage.payload.id)
      testHelper.expectObject(data, reviewTypeMessage.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create review type message - already exists', (done) => {
    const message = _.cloneDeep(reviewTypeMessage)
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(409)
        return
      }
      throw new Error('There should be conflict error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update review type message', (done) => {
    co(function * () {
      yield ProcessorService.update(updatedReviewType)
      const data = yield testHelper.getESData(updatedReviewType.payload.id)
      testHelper.expectObject(data, updatedReviewType.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update review type message - not found', (done) => {
    const message = _.cloneDeep(reviewTypeMessage)
    message.topic = 'submission.notification.update'
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete review type message', (done) => {
    const message = _.cloneDeep(reviewTypeMessage)
    message.topic = 'submission.notification.delete'
    message.payload.id = uuid()
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(message.payload.id)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete review type message - not found', (done) => {
    const message = _.cloneDeep(reviewTypeMessage)
    message.topic = 'submission.notification.delete'
    co(function * () {
      try {
        yield ProcessorService.remove(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create review summation message', (done) => {
    co(function * () {
      yield ProcessorService.create(reviewSummationMessage)
      const data = yield testHelper.getESData(reviewSummationMessage.payload.id)
      testHelper.expectObject(data, reviewSummationMessage.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create review summation message - already exists', (done) => {
    const message = _.cloneDeep(reviewSummationMessage)
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(409)
        return
      }
      throw new Error('There should be conflict error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update review summation message', (done) => {
    co(function * () {
      yield ProcessorService.update(updatedReviewSummation)
      const data = yield testHelper.getESData(updatedReviewSummation.payload.id)
      testHelper.expectObject(data, updatedReviewSummation.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update review summation message - not found', (done) => {
    const message = _.cloneDeep(reviewSummationMessage)
    message.topic = 'submission.notification.update'
    message.payload.id = uuid()
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete review summation message', (done) => {
    const message = _.cloneDeep(reviewSummationMessage)
    message.topic = 'submission.notification.delete'
    message.payload.id = uuid()
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(message.payload.id)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete review summation message - not found', (done) => {
    const message = _.cloneDeep(reviewSummationMessage)
    message.topic = 'submission.notification.delete'
    co(function * () {
      try {
        yield ProcessorService.remove(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create message - invalid parameters, missing originator', (done) => {
    const message = _.cloneDeep(submissionMessage)
    delete message.originator
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create message - invalid parameters, wrong mime-type', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message['mime-type'] = 123
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create message - invalid parameters, missing payload id', (done) => {
    const message = _.cloneDeep(submissionMessage)
    delete message.payload.id
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('create message - invalid parameters, invalid payload resource', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.payload.resource = 'abc'
    co(function * () {
      try {
        yield ProcessorService.create(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update message - invalid parameters, missing payload', (done) => {
    const message = _.cloneDeep(submissionMessage)
    delete message.payload
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update message - invalid parameters, missing payload resource', (done) => {
    const message = _.cloneDeep(submissionMessage)
    delete message.payload.resource
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update message - invalid parameters, invalid timestamp', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.timestamp = 'abc'
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete message - invalid parameters, invalid payload id', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.payload.id = 123
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('delete message - invalid parameters, invalid topic', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.topic = [1, 2]
    co(function * () {
      try {
        yield ProcessorService.update(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)
})

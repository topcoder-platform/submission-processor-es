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
  reviewTypeMessage, reviewSummationMessage } = require('../common/testData')

describe('TC Submission Processor Tests', () => {
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
    co(function * () {
      try {
        yield ProcessorService.create(submissionMessage)
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
    const message = _.cloneDeep(submissionMessage)
    message.topic = 'submission.notification.update'
    message.payload.url = 'http://test.com/other'
    message.payload.memberId = uuid()
    message.payload.updatedBy = 'tester'
    co(function * () {
      yield ProcessorService.update(message)
      const data = yield testHelper.getESData(submissionMessage.payload.id)
      testHelper.expectObject(data, message.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(10000)

  it('update submission message - not found', (done) => {
    const message = _.cloneDeep(submissionMessage)
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

  it('delete submission message', (done) => {
    const message = _.cloneDeep(submissionMessage)
    message.topic = 'submission.notification.delete'
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(submissionMessage.payload.id)
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
    co(function * () {
      try {
        yield ProcessorService.create(reviewMessage)
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
    const message = _.cloneDeep(reviewMessage)
    message.topic = 'submission.notification.update'
    message.payload.score = 80
    message.payload.typeId = uuid()
    message.payload.updatedBy = 'tester'
    co(function * () {
      yield ProcessorService.update(message)
      const data = yield testHelper.getESData(reviewMessage.payload.id)
      testHelper.expectObject(data, message.payload)
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
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(reviewMessage.payload.id)
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
    co(function * () {
      try {
        yield ProcessorService.create(reviewTypeMessage)
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
    const message = _.cloneDeep(reviewTypeMessage)
    message.topic = 'submission.notification.update'
    message.payload.name = 'new name'
    message.payload.isActive = false
    co(function * () {
      yield ProcessorService.update(message)
      const data = yield testHelper.getESData(reviewTypeMessage.payload.id)
      testHelper.expectObject(data, message.payload)
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
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(reviewTypeMessage.payload.id)
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
    co(function * () {
      try {
        yield ProcessorService.create(reviewSummationMessage)
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
    const message = _.cloneDeep(reviewSummationMessage)
    message.topic = 'submission.notification.update'
    message.payload.submissionId = uuid()
    message.payload.aggregateScore = 66
    message.payload.scoreCardId = uuid()
    message.payload.isPassing = false
    message.payload.updatedBy = 'user'
    co(function * () {
      yield ProcessorService.update(message)
      const data = yield testHelper.getESData(reviewSummationMessage.payload.id)
      testHelper.expectObject(data, message.payload)
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
    co(function * () {
      yield ProcessorService.remove(message)
      try {
        yield testHelper.getESData(reviewSummationMessage.payload.id)
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

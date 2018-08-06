/*
 * Setting up Mock for all tests
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const nock = require('nock')
const prepare = require('mocha-prepare')
const testData = require('../common/testData')

const ops = ['_create', '_update'] // ES operations

prepare(function (done) {
  // called before loading of test cases
  nock(/.com|localhost/)
    .persist()
    .filteringPath((path) => {
      const parts = path.split('/')
      const op = parts.pop()
      const id = parts.pop()
      if (op === '_source') { // For GET operation
        return id + '/' + op
      } else if (ops.indexOf(op) !== -1 && testData.existentIds.indexOf(id) !== -1) { // For Create & Update
        return 'exist/' + op
      } else if (testData.existentIds.indexOf(op) !== -1) { // For Delete
        return 'exist'
      }
      return op
    })
    .post('exist/_create')
    .query(true)
    .reply(200)
    .post(`_create`)
    .query(true)
    .reply(409)
    .post(`exist/_update`)
    .query(true)
    .reply(200)
    .post(`_update`)
    .query(true)
    .reply(404)
    .delete('exist')
    .query(true)
    .reply(404)
    .delete(() => true)
    .query(true)
    .reply(204)
    .get(`${testData.submissionMessage.payload.id}/_source`)
    .query(true)
    .reply(200, testData.submissionMessage.payload)
    .get(`${testData.updatedSubmission.payload.id}/_source`)
    .query(true)
    .reply(200, testData.updatedSubmission.payload)
    .get(`${testData.reviewMessage.payload.id}/_source`)
    .query(true)
    .reply(200, testData.reviewMessage.payload)
    .get(`${testData.updatedReview.payload.id}/_source`)
    .query(true)
    .reply(200, testData.updatedReview.payload)
    .get(`${testData.reviewTypeMessage.payload.id}/_source`)
    .query(true)
    .reply(200, testData.reviewTypeMessage.payload)
    .get(`${testData.updatedReviewType.payload.id}/_source`)
    .query(true)
    .reply(200, testData.updatedReviewType.payload)
    .get(`${testData.reviewSummationMessage.payload.id}/_source`)
    .query(true)
    .reply(200, testData.reviewSummationMessage.payload)
    .get(`${testData.updatedReviewSummation.payload.id}/_source`)
    .query(true)
    .reply(200, testData.updatedReviewSummation.payload)
    .get(() => true)
    .query(true)
    .reply(404)
  done()
}, function (done) {
  // called after all test completes (regardless of errors)
  nock.cleanAll()
  done()
})

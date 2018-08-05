/**
 * Contains helper methods for tests
 */

const _ = require('lodash')
const config = require('config')
const expect = require('chai').expect
const helper = require('../../src/common/helper')

const client = helper.getESClient()

/**
 * Get elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} the elastic search data of id of configured index type in configured index
 */
function * getESData (id) {
  return yield client.getSource({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Ensures the target object match all fields/values of the expected object.
 * @param {Object} target the target object
 * @param {Object} expected the expected object
 */
function expectObject (target, expected) {
  _.forIn(expected, (value, key) => {
    expect(target[key]).to.equal(value)
  })
}

module.exports = {
  getESData,
  expectObject
}

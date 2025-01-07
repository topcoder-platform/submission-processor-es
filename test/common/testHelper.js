/**
 * Contains helper methods for tests
 */

const _ = require('lodash')
const config = require('config')
const expect = require('chai').expect
const helper = require('../../src/common/helper')

const client = helper.getOSClient()

/**
 * Get opensearch data.
 * @param {String} id the opensearch data id
 * @returns {Object} the opensearch data of id of configured index type in configured index
 */
function * getOSData (id) {
  return yield client.getSource({
    index: config.get('osConfig.OS_INDEX'),
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
  getOSData,
  expectObject
}

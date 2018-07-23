/**
 * Contains generic helper methods
 */
const _ = require('lodash')
const config = require('config')
const elasticsearch = require('elasticsearch')

/**
 * Get elastic search client.
 * @returns {Object} the elastic search client
 */
function getESClient () {
  return new elasticsearch.Client(_.cloneDeep(config.ELASTICSEARCH_CONFIG))
}

module.exports = {
  getESClient
}

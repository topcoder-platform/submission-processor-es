/**
 * Contains generic helper methods
 */

const config = require('config')
const elasticsearch = require('@elastic/elasticsearch')
// ES Client mapping
const esClients = {}

/**
 * Get ES Client
 * @return {Object} Elastic Host Client Instance
 */
function getESClient () {
  if (!esClients.client) {
    esClients.client = new elasticsearch.Client({ node: config.get('esConfig.HOST') })
  }
  return esClients.client
}

module.exports = {
  getESClient
}

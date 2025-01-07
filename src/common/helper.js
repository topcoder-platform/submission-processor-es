/**
 * Contains generic helper methods
 */

const config = require('config')
const opensearch = require('@opensearch-project/opensearch')
// OS Client mapping
const osClients = {}

/**
 * Get OS Client
 * @return {Object} Opensearch Host Client Instance
 */
function getOSClient () {
  if (!osClients.client) {
    osClients.client = new opensearch.Client({ node: config.get('osConfig.HOST') })
  }
  return osClients.client
}

module.exports = {
  getOSClient
}

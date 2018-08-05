/**
 * This is used to view Elasticsearch data of given id of configured index type in configured index.
 * Usage:
 * node test/view-data {elasticsearch-id}
 */
const co = require('co')
const logger = require('../../src/common/logger')
const testHelper = require('./testHelper')

if (process.argv.length < 3) {
  logger.error('Missing argument for Elasticsearch id.')
  process.exit()
}

co(function * () {
  const data = yield testHelper.getESData(process.argv[2])
  logger.info('Elasticsearch data:')
  logger.info(JSON.stringify(data, null, 4))
}).then(() => {
  process.exit()
}).catch((e) => {
  if (e.statusCode === 404) {
    logger.info('The data is not found.')
  } else {
    logger.error(e)
  }
  process.exit()
})

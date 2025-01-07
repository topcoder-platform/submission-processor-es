/**
 * This is used to view Opensearch data of given id of configured index type in configured index.
 * Usage:
 * node test/view-data {Opensearch-id}
 */
const co = require('co')
const logger = require('../../src/common/logger')
const testHelper = require('./testHelper')

if (process.argv.length < 3) {
  logger.error('Missing argument for Opensearch id.')
  process.exit()
}

co(function * () {
  const data = yield testHelper.getOSData(process.argv[2])
  logger.info('Opensearch data:')
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

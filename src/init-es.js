/**
 * Initialize elastic search.
 * It will create configured index in elastic search if it is not present.
 * It can delete and re-create index if providing an extra 'force' argument.
 * Usage:
 * node src/init-es
 * node src/init-es force
 */
const co = require('co')
const config = require('config')
const logger = require('./common/logger')
const helper = require('./common/helper')

const client = helper.getESClient()

co(function * () {
  if (process.argv.length === 3 && process.argv[2] === 'force') {
    logger.info(`Delete index ${config.esConfig.ES_INDEX} if any.`)
    try {
      yield client.indices.delete({ index: config.esConfig.ES_INDEX })
    } catch (err) {
      // ignore
    }
  }

  const exists = yield client.indices.exists({ index: config.esConfig.ES_INDEX })
  if (exists) {
    logger.info(`The index ${config.esConfig.ES_INDEX} exists.`)
  } else {
    logger.info(`The index ${config.esConfig.ES_INDEX} will be created.`)
    yield client.indices.create({ index: config.esConfig.ES_INDEX })
  }
}).then(() => {
  logger.info('done')
  process.exit()
}).catch((e) => {
  logger.error(e)
  process.exit()
})

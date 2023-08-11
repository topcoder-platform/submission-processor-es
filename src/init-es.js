/**
 * Initialize elastic search.
 * It will create configured index in elastic search if it is not present.
 * It can delete and re-create index if providing an extra 'force' argument.
 * Usage:
 * node src/init-es
 * node src/init-es force
 */
const config = require('config')
const logger = require('./common/logger')
const helper = require('./common/helper')

const client = helper.getESClient()

const init = async () => {
  if (process.argv.length === 3 && process.argv[2] === 'force') {
    logger.info(`Delete index ${config.esConfig.ES_INDEX} if any.`)
    try {
      await client.indices.delete({ index: config.esConfig.ES_INDEX })
    } catch (err) {
      // ignore
    }
  }

  const exists = await client.indices.exists({ index: config.esConfig.ES_INDEX })
  if (exists) {
    logger.info(`The index ${config.esConfig.ES_INDEX} exists.`)
  } else {
    logger.info(`The index ${config.esConfig.ES_INDEX} will be created.`)
    await client.indices.create({ index: config.esConfig.ES_INDEX })
  }
}

init().then(() => {
  logger.info('done')
  process.exit()
}).catch((e) => {
  logger.error(e)
  process.exit()
})

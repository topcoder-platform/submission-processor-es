/**
 * The application entry point
 */

global.Promise = require('bluebird')
const config = require('config')
const logger = require('./common/logger')
const Kafka = require('no-kafka')
const ProcessorService = require('./services/ProcessorService')
const healthcheck = require('topcoder-healthcheck-dropin')

// create consumer
const options = { connectionString: config.KAFKA_URL, groupId: config.KAFKA_GROUP_ID, handlerConcurrency: 1 }
if (config.KAFKA_CLIENT_CERT && config.KAFKA_CLIENT_CERT_KEY) {
  options.ssl = { cert: config.KAFKA_CLIENT_CERT, key: config.KAFKA_CLIENT_CERT_KEY }
}
const consumer = new Kafka.GroupConsumer(options)

// data handler
const dataHandler = async (messageSet, topic, partition) => Promise.each(messageSet, async (m) => {
  const message = m.message.value.toString('utf8')
  logger.info(`Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${
    m.offset}; Message: ${message}.`)
  let messageJSON
  try {
    messageJSON = JSON.parse(message)
  } catch (e) {
    logger.error('Invalid message JSON.')
    logger.error(e)
    // ignore the message
    return
  }
  if (messageJSON.topic !== topic) {
    logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)
    // ignore the message
    return
  }
  try {
    switch (topic) {
      case config.CREATE_DATA_TOPIC:
        await ProcessorService.create(messageJSON)
        break
      case config.UPDATE_DATA_TOPIC:
        await ProcessorService.update(messageJSON)
        break
      case config.DELETE_DATA_TOPIC:
        await ProcessorService.remove(messageJSON)
        break
      default:
        throw new Error(`Invalid topic: ${topic}`)
    }

    // commit offset
    await consumer.commitOffset({ topic, partition, offset: m.offset })
  } catch (err) {
    logger.error(err)
  }
})

// check if there is kafka connection alive
function check () {
  if (!consumer.client.initialBrokers && !consumer.client.initialBrokers.length) {
    return false
  }
  let connected = true
  consumer.client.initialBrokers.forEach(conn => {
    logger.debug(`url ${conn.server()} - connected=${conn.connected}`)
    connected = conn.connected & connected
  })
  return connected
}

const topics = [config.CREATE_DATA_TOPIC, config.UPDATE_DATA_TOPIC, config.DELETE_DATA_TOPIC]
// consume configured topics
consumer
  .init([{
    subscriptions: topics,
    handler: dataHandler
  }])
  .then(() => {
    healthcheck.init([check])
  })
  .catch((err) => logger.error(err))

/**
 * The application entry point
 */
global.Promise = require('bluebird')
const _ = require('lodash')
const config = require('config')
const logger = require('./common/logger')
const Kafka = require('no-kafka')
const co = require('co')
const ProcessorService = require('./services/ProcessorService')
const healthcheck = require('topcoder-healthcheck-dropin')
const tracer = require('./common/tracer')

// Initialize tracing if configured.
// Even if tracer is not initialized, all calls to tracer module will not raise any errors
if (config.has('tracing')) {
  tracer.initTracing(config.get('tracing'))
}

// create consumer
const options = { connectionString: config.KAFKA_URL, handlerConcurrency: 1 }
if (config.KAFKA_CLIENT_CERT && config.KAFKA_CLIENT_CERT_KEY) {
  options.ssl = { cert: config.KAFKA_CLIENT_CERT, key: config.KAFKA_CLIENT_CERT_KEY }
}
const consumer = new Kafka.SimpleConsumer(options)

// data handler
const dataHandler = (messageSet, topic, partition) => Promise.each(messageSet, (m) => {
  const span = tracer.startSpans('dataHandler')
  span.setTag('kafka.topic', topic)
  span.setTag('message_bus.destination', topic)
  span.setTag('kafka.partition', partition)
  span.setTag('kafka.offset', m.offset)
  span.setTag('span.kind', 'consumer')

  const message = m.message.value.toString('utf8')
  logger.info(`Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${
    m.offset}; Message: ${message}.`)

  const parserSpan = tracer.startChildSpans('parseMessage', span)
  let messageJSON
  try {
    messageJSON = JSON.parse(message)
  } catch (e) {
    logger.error('Invalid message JSON.')
    logger.error(e)

    parserSpan.setTag('error', true)
    parserSpan.log({
      event: 'error',
      message: e.message,
      stack: e.stack,
      'error.object': e
    })
    parserSpan.finish()
    span.finish()

    return
  }

  parserSpan.finish()

  if (messageJSON.topic !== topic) {
    logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)
    // ignore the message
    span.setTag('error', true)
    span.log({
      event: 'error',
      message: `The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}`
    })
    span.finish()
    return
  }

  let serviceSpan

  return co(function * () {
    switch (topic) {
      case config.CREATE_DATA_TOPIC:
        serviceSpan = tracer.startChildSpans('ProcessorService.create', span)
        yield ProcessorService.create(messageJSON, serviceSpan)
        break
      case config.UPDATE_DATA_TOPIC:
        serviceSpan = tracer.startChildSpans('ProcessorService.update', span)
        yield ProcessorService.update(messageJSON, serviceSpan)
        break
      case config.DELETE_DATA_TOPIC:
        serviceSpan = tracer.startChildSpans('ProcessorService.remove', span)
        yield ProcessorService.remove(messageJSON, serviceSpan)
        break
      default:
        throw new Error(`Invalid topic: ${topic}`)
    }
  })
  // commit offset
    .then(() => {
      consumer.commitOffset({ topic, partition, offset: m.offset })

      serviceSpan.finish()
      span.finish()
    })
    .catch((err) => {
      logger.error(err)
      if (serviceSpan) {
        serviceSpan.log({
          event: 'error',
          message: err.message,
          stack: err.stack,
          'error.object': err
        })
        serviceSpan.setTag('error', true)
        serviceSpan.finish()
      }

      span.setTag('error', true)
      span.finish()
    })
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

consumer
  .init()
  // consume configured topics
  .then(() => {
    healthcheck.init([check])

    const topics = [config.CREATE_DATA_TOPIC, config.UPDATE_DATA_TOPIC, config.DELETE_DATA_TOPIC]
    _.each(topics, (tp) => consumer.subscribe(tp, { time: Kafka.LATEST_OFFSET }, dataHandler))
  })
  .catch((err) => logger.error(err))

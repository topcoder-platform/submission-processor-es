/**
 * The default configuration file.
 */

module.exports = {
  DISABLE_LOGGING: process.env.DISABLE_LOGGING || false, // If true, logging will be disabled
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  CREATE_DATA_TOPIC: process.env.CREATE_DATA_TOPIC || 'submission.notification.create',
  UPDATE_DATA_TOPIC: process.env.UPDATE_DATA_TOPIC || 'submission.notification.update',
  DELETE_DATA_TOPIC: process.env.DELETE_DATA_TOPIC || 'submission.notification.delete',

  esConfig: {
    HOST: process.env.ES_HOST,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1', // AWS Region to be used if we use AWS ES
    API_VERSION: process.env.ES_API_VERSION || '6.3',
    ES_INDEX: process.env.ES_INDEX || 'submission',
    ES_TYPE: process.env.ES_TYPE || '_doc' // ES 6.x accepts only 1 Type per index and it's mandatory to define it
  }
}

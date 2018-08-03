/**
 * The configuration file.
 */
const AWS = require('aws-sdk')
const httpAWSes = require('http-aws-es')

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  CREATE_DATA_TOPIC: process.env.CREATE_DATA_TOPIC || 'submission.notification.create',
  UPDATE_DATA_TOPIC: process.env.UPDATE_DATA_TOPIC || 'submission.notification.update',
  DELETE_DATA_TOPIC: process.env.DELETE_DATA_TOPIC || 'submission.notification.delete',

  // see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html
  // for full config details, for SSL connection, see the ssl field details in above page
  ELASTICSEARCH_CONFIG: {
    apiVersion: process.env.ES_API_VERSION || '6.3',
    host: process.env.ELASTICSEARCH_HOST || 'localhost:9200',
    connectionClass: httpAWSes,
    amazonES: {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: new AWS.EnvironmentCredentials('AWS')
    }
  },

  ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX || 'submission-index',
  ELASTICSEARCH_INDEX_TYPE: process.env.ELASTICSEARCH_INDEX_TYPE || 'submission'
}

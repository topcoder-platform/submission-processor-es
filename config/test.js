/**
 * Configuration file to be used while running tests
 */

module.exports = {
  DISABLE_LOGGING: false, // If true, logging will be disabled
  LOG_LEVEL: 'debug',
  esConfig: {
    ES_HOST: process.env.ES_HOST || 'https://test.es.com',
    ES_INDEX: process.env.ES_INDEX_TEST || 'submission-test',
    ES_TYPE: process.env.ES_TYPE_TEST || '_doc' // ES 6.x accepts only 1 Type per index and it's mandatory to define it
  }
}

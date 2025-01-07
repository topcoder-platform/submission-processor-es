/**
 * Configuration file to be used while running tests
 */

module.exports = {
  DISABLE_LOGGING: false, // If true, logging will be disabled
  LOG_LEVEL: 'debug',
  osConfig: {
    OS_HOST: process.env.OS_HOST || 'https://test.es.com',
    OS_INDEX: process.env.OS_INDEX_TEST || 'submission-test'
  }
}

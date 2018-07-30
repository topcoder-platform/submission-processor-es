# Topcoder - Submission Processor

## Dependencies

- nodejs https://nodejs.org/en/ (v8+)
- Kafka
- ElasticSearch
- Docker, Docker Compose

## Notes

In Elasticsearch v6+, it can support one type per index, see
https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html
so for all 4 types, same configured index type is used, types are distinguished by the 'resource' attribute of indexed data.

## Configuration

Configuration for the notification server is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level; default value: 'debug'
- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to certificate file or certificate content
- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to private key file or private key content
- CREATE_DATA_TOPIC: create data Kafka topic, default value is 'submission.notification.create'
- UPDATE_DATA_TOPIC: update data Kafka topic, default value is 'submission.notification.update'
- DELETE_DATA_TOPIC: delete data Kafka topic, default value is 'submission.notification.delete'
- ELASTICSEARCH_CONFIG: the config to create Elasticsearch client, see
    https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html
    for full details, SSL connection can be configured in ssl config field
- ELASTICSEARCH_INDEX: the Elasticsearch index to store Kafka messages data, default value is 'submission-index'
- ELASTICSEARCH_INDEX_TYPE: the Elasticsearch index type name, default value is 'submission'

Also note that there is a `/health` endpoint that checks for the health of the app. This sets up an expressjs server and listens on the environment variable `PORT`. It's not part of the configuration file and needs to be passed as an environment variable

## Local Kafka setup

- `http://kafka.apache.org/quickstart` contains details to setup and manage Kafka server,
  below provides details to setup Kafka server in Mac, Windows will use bat commands in bin/windows instead
- download kafka at `https://www.apache.org/dyn/closer.cgi?path=/kafka/1.1.0/kafka_2.11-1.1.0.tgz`
- extract out the doanlowded tgz file
- go to extracted directory kafka_2.11-0.11.0.1
- start ZooKeeper server:
  `bin/zookeeper-server-start.sh config/zookeeper.properties`
- use another terminal, go to same directory, start the Kafka server:
  `bin/kafka-server-start.sh config/server.properties`
- note that the zookeeper server is at localhost:2181, and Kafka server is at localhost:9092
- use another terminal, go to same directory, create some topics:
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic submission.notification.create`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic submission.notification.update`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic submission.notification.delete`
- verify that the topics are created:
  `bin/kafka-topics.sh --list --zookeeper localhost:2181`,
  it should list out the created topics
- run the producer and then write some message into the console to send to the `submission.notification.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic submission.notification.create`
  in the console, write message, one message per line:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "id": "1111", "type": "ContestSubmission", "url": "http://test.com/path", "memberId": "aaaa", "challengeId": "bbbb", "created": "2018-01-02T00:00:00", "updated": "2018-02-03T00:00:00", "createdBy": "admin", "updatedBy": "user" } }`
- optionally, use another terminal, go to same directory, start a consumer to view the messages:
  `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic submission.notification.create --from-beginning`
- writing/reading messages to/from other topics are similar

## ElasticSearch setup

- go to docker folder, run `docker-compose up`

## Local deployment

- install dependencies `npm i`
- run code lint check `npm run lint`, running `npm run lint-fix` can fix some lint errors if any
- initialize Elasticsearch, create configured Elasticsearch index if not present: `npm run init-es`
- or to re-create the index: `npm run init-es force`
- run tests `npm run test`
- start processor app `npm start`

## Verification

- start kafka server, start elasticsearch, initialize Elasticsearch, start processor app
- start kafka-console-producer to write messages to `submission.notification.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic submission.notification.create`
- write message:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "id": "1111", "type": "ContestSubmission", "url": "http://test.com/path", "memberId": "aaaa", "challengeId": "bbbb", "created": "2018-01-02T00:00:00", "updated": "2018-02-03T00:00:00", "createdBy": "admin", "updatedBy": "user" } }`
- run command `npm run view-data 1111` to view the created data, you will see the data are properly created:

```bash
info: Elasticsearch data:
info: {
    "resource": "submission",
    "id": "1111",
    "type": "ContestSubmission",
    "url": "http://test.com/path",
    "memberId": "aaaa",
    "challengeId": "bbbb",
    "created": "2018-01-02T00:00:00",
    "updated": "2018-02-03T00:00:00",
    "createdBy": "admin",
    "updatedBy": "user"
}
```

- you may write invalid message like:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "type": "ContestSubmission", "url": "http://test.com/path", "memberId": "aaaa", "challengeId": "bbbb", "created": "2018-01-02T00:00:00", "updated": "2018-02-03T00:00:00", "createdBy": "admin", "updatedBy": "user" } }`
- then in the app console, you will see error message

- start kafka-console-producer to write messages to `submission.notification.update` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic submission.notification.update`
- write message:
  `{ "topic": "submission.notification.update", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "id": "1111", "type": "ContestSubmission2", "url": "http://test.com/path2", "memberId": "aaaa2", "challengeId": "bbbb2", "created": "2018-03-03T00:00:00", "updated": "2018-04-04T00:00:00", "createdBy": "admin2", "updatedBy": "user2" } }`
- run command `npm run view-data 1111` to view the created data, you will see the data are properly updated:

```bash
info: Elasticsearch data:
info: {
    "resource": "submission",
    "id": "1111",
    "type": "ContestSubmission2",
    "url": "http://test.com/path2",
    "memberId": "aaaa2",
    "challengeId": "bbbb2",
    "created": "2018-03-03T00:00:00",
    "updated": "2018-04-04T00:00:00",
    "createdBy": "admin2",
    "updatedBy": "user2"
}
```

- start kafka-console-producer to write messages to `submission.notification.delete` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic submission.notification.delete`
- write message:
  `{ "topic": "submission.notification.delete", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "id": "1111", "type": "ContestSubmission2", "url": "http://test.com/path2", "memberId": "aaaa2", "challengeId": "bbbb2", "created": "2018-03-03T00:00:00", "updated": "2018-04-04T00:00:00", "createdBy": "admin2", "updatedBy": "user2" } }`
- run command `npm run view-data 1111` to view the created data, you will see the data are properly deleted:

```bash
info: The data is not found.
```

- management of other resource types are similar, below gives valid Kafka messages for other resource types, so that you may test them easily,
  you may need to update their topic to `submission.notification.create`, `submission.notification.update` or `submission.notification.delete`
- review:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "review", "id": "2222", "score": 88, "typeId": "ababab", "reviewerId": "aaaa", "scoreCardId": "bbbbxxx", "submissionId": "fjfjfj", "created": "2018-01-02T00:00:00", "updated": "2018-02-03T00:00:00", "createdBy": "admin", "updatedBy": "user" } }`
- reviewType:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "reviewType", "id": "3333", "name": "some review type", "isActive": true } }`
- reviewSummation:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "reviewSummation", "id": "4444", "submissionId": "asdfasdf", "aggregateScore": 98, "scoreCardId": "abbccaaa", "isPassing": true, "created": "2018-01-02T00:00:00", "updated": "2018-02-03T00:00:00", "createdBy": "admin", "updatedBy": "user" } }`

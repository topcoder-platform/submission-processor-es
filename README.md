# Topcoder - Submission Processor

## Dependencies

- nodejs https://nodejs.org/en/ (v8+)
- Kafka
- ElasticSearch
- Docker, Docker Compose

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

Refer to `esConfig` variable in `config/default.js` for ES related configuration.

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

## Local deployment

- install dependencies `npm i`
- run code lint check `npm run lint`, running `npm run lint-fix` can fix some lint errors if any
- initialize Elasticsearch, create configured Elasticsearch index if not present: `npm run init-es`
- or to re-create the index: `npm run init-es force`
- run tests `npm run test`
- start processor app `npm start`

## Local Deployment with Docker

To run the Submission ES Processor using docker, follow the below steps

1. Navigate to the directory `docker`

2. Rename the file `sample.api.env` to `api.env`

3. Set the required AWS credentials in the file `api.env`

4. Once that is done, run the following command

```
docker-compose up
```

5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## Unit tests and Integration tests

Integration tests use different index `submission-test` which is not same as the usual index `submission`.

Please ensure to create the index `submission-test` or the index specified in the environment variable `ES_INDEX_TEST` before running the Integration tests. You could re-use the existing scripts to create index but you would need to set the below environment variable

```
export ES_INDEX=submission-test
```

#### Running unit tests and coverage

To run unit tests alone

```
npm run test
```

To run unit tests with coverage report

```
npm run cov
```

#### Running integration tests and coverage

To run integration tests alone

```
npm run e2e
```

To run integration tests with coverage report

```
npm run cov-e2e
```


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


### Verification for combining review and reviewSummation with Submission 

- From the `submissions-api` repository, Run the command `npm run create-index` to create index with specified data types

- Run the command `npm run init-es` to load test data into ES

- Now from the Kafka console producer, Write the below messages into topic `submission.notification.create`

```
{ "topic":"submission.notification.create", "originator":"submission-api", "timestamp":"2018-08-06T15:46:05.575Z", "mime-type":"application/json", "payload":{ "resource":"review", "id": "d34d4180-65aa-42ec-a945-5fd21dec0502", "score": 92.0, "typeId": "c56a4180-65aa-42ec-a945-5fd21dec0501", "reviewerId": "c23a4180-65aa-42ec-a945-5fd21dec0503", "scoreCardId": "b25a4180-65aa-42ec-a945-5fd21dec0503", "submissionId": "a12a4180-65aa-42ec-a945-5fd21dec0501", "created": "2018-05-20T07:00:30.123Z", "updated": "2018-06-01T07:36:28.178Z", "createdBy": "admin", "updatedBy": "admin" } }


{ "topic":"submission.notification.create", "originator":"submission-api", "timestamp":"2018-08-06T15:46:05.575Z", "mime-type":"application/json", "payload":{ "resource":"review", "id": "d34d4180-65aa-42ec-a945-5fd21dec0503", "score": 95.0, "typeId": "c56a4180-65aa-42ec-a945-5fd21dec0501", "reviewerId": "c23a4180-65aa-42ec-a945-5fd21dec0504", "scoreCardId": "b25a4180-65aa-42ec-a945-5fd21dec0503", "submissionId": "a12a4180-65aa-42ec-a945-5fd21dec0501", "created": "2018-05-20T07:00:30.123Z", "updated": "2018-06-01T07:36:28.178Z", "createdBy": "admin", "updatedBy": "admin" } }
```

- This will create two reviews as well as attach the reviews with a submission

- To look at the updated submission in ES, Run the below command

```
npm run view-data a12a4180-65aa-42ec-a945-5fd21dec0501
```

- To check the update of reviews, Write the below message into topic `submission.notification.update` and check data using above `view-data` command

```
{ "topic":"submission.notification.update", "originator":"submission-api", "timestamp":"2018-08-06T15:46:05.575Z", "mime-type":"application/json", "payload":{ "resource":"review", "id": "d34d4180-65aa-42ec-a945-5fd21dec0502", "score": 93.2, "updatedBy": "test" } }
```

- To check the deletion of reviews, Write the below message into topic `submission.notification.delete` and check data using above `view-data` command

```
{ "topic":"submission.notification.delete", "originator":"submission-api", "timestamp":"2018-08-06T15:46:05.575Z", "mime-type":"application/json", "payload":{ "resource":"review", "id": "d34d4180-65aa-42ec-a945-5fd21dec0503" } }
```
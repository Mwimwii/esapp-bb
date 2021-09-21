Backend
==================

# Overview
* A Node.js application running the titl dashboard and coordinating
the master database. Built on top of [FoalTS](https://foalts.org/docs/)

# Getting Started
* See the [setup.md](/docs/setup.md)

# Database
## ORM
* [Sequelize](https://sequelize.org/) is probably the most well known
ORM for node.js. However, it is currently looking for [maintainers](https://github.com/sequelize/sequelize/#note-looking-for-maintainers)
and also doesn't have great typescript support out of the box. There are
community provided packages like [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript).
* Type ORM is what we're using due to its nice [documentation](https://typeorm.io/#/) & [docs](https://github.com/typeorm/typeorm/tree/master/docs)
and built in typescript support & [docs](https://orkhan.gitbook.io/typeorm/)

## Models
* To visualize the existing models, [typeorm-uml](https://github.com/eugene-manuilov/typeorm-uml)
is used to provide a UML of the models. The command to create an updated UML is:
```
yarn generate:uml
```
and the resulting file will go to the docs directory
* In order for the UML's to be generated correctly it is important that in the
models that relative references are used **only**. The UML script will break
trying to resolve the dependencies with an error:
```
(node:64110) UnhandledPromiseRejectionWarning: TypeError: Class extends value undefined is not a constructor or null
```
* There is a Github action to check against this as well.

# Creating A Database
* If you're running postgres locally you can access and create databases
using the CLI:
```
psql postgres postgres
```
* List databases:
```
\l
```
* Create a database:
```
CREATE DATABASE titldb;
```
* See [models.md](/src/models/README.md) for info on database model column types

## Available Env Variables
* You can see the [documentation](https://typeorm.io/#/using-ormconfig/using-ormconfigjs)
for available typeorm environment variable available configs:
```
TYPEORM_CACHE
TYPEORM_CACHE_ALWAYS_ENABLED
TYPEORM_CACHE_DURATION
TYPEORM_CACHE_OPTIONS
TYPEORM_CONNECTION
TYPEORM_DATABASE
TYPEORM_DEBUG
TYPEORM_DRIVER_EXTRA
TYPEORM_DROP_SCHEMA
TYPEORM_ENTITIES
TYPEORM_ENTITIES_DIR
TYPEORM_ENTITY_PREFIX
TYPEORM_HOST
TYPEORM_LOGGER
TYPEORM_LOGGING
TYPEORM_MAX_QUERY_EXECUTION_TIME
TYPEORM_MIGRATIONS
TYPEORM_MIGRATIONS_DIR
TYPEORM_MIGRATIONS_RUN
TYPEORM_MIGRATIONS_TABLE_NAME
TYPEORM_PASSWORD
TYPEORM_PORT
TYPEORM_SCHEMA
TYPEORM_SID
TYPEORM_SUBSCRIBERS
TYPEORM_SUBSCRIBERS_DIR
TYPEORM_SYNCHRONIZE
TYPEORM_URL
TYPEORM_USERNAME
TYPEORM_UUID_EXTENSION
```

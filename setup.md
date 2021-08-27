Setup
==================

# Installation
* You need to install [yarn](https://yarnpkg.com/) as that is this application’s
package manager
* Once yarn is installed you need to install the app’s dependencies:
```
yarn
```

# Running The Application
* Postgres needs to be running. [DBngin](https://dbngin.com/)
is great to run multiple versions of postgres on your mac. There is a docker
compose file for convenience if you prefer to run your database is a docker container
* Copy over the `.env.example` to `.env` and edit it as needed.
* To start the application:
```
yarn start
```
* The application by default runs at port `8000`. You can navigate to
[localhost:8000/health](http://localhost:8000/health) to verify that the application is running

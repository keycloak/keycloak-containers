# Keycloak MongoDB

Extends the Keycloak docker image to use MongoDB

## Usage

### Start a MongoDB instance

First start a MongoDB instance using the MongoDB docker image:

    docker run --name mongo -e MONGODB_DBNAME=keycloak -d mongo

### Start a Keycloak instance

Start a Keycloak instance and connect to the MongoDB instance:

    docker run --name keycloak --link mongo:mongo jboss/keycloak-mongo

### Environment variables

When starting the Keycloak instance you can pass a number of environment variables to configure how it connects to MongoDB. For example:

    docker run --name keycloak --link mongo:mongo -e MONGODB_DBNAME=keycloak jboss/keycloak-mongo

#### MONGODB_DBNAME

Specify name of MongoDB database (optional, default is `keycloak`).

### You can alternatively use docker-compose

    docker-compose up -d

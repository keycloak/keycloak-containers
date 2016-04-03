# Keycloak MongoDB

This Keycloak image extends the base Keycloak docker image to use MongoDB. To build and properly name this image, run:

```
docker build -t jboss/keycloak-mongo .
```

## Usage

### Use `docker-compose` to start all services

To start both the Keycloak and the MongoDB instances, use `docker-compose`:

```
docker-compose up
```

[Refer to the documentation on `docker-compose` for more information regarding this tool.](https://docs.docker.com/compose/reference/overview/)

### Connect to an existing MongoDB instance

To connect to an existing MongoDB instance, use `docker run` and specify the MongoDB connection criteria via environment variables:

```
docker run --name keycloak -e MONGO_DATABASE=kcdatabase -e MONGO_USER=kcuser jboss/keycloak-mongo
```

### Environment variables

When starting the container via `docker run` you can pass a number of environment variables to configure the MongoDB connection criteria. For example:

#### MONGO_HOST

Specify the address of the server hosting the MongoDB database (required).

#### MONGO_PORT

Specify the port for MongoDB database (optional, default is `27017`).

#### MONGO_DATABASE

Specify the name of MongoDB database (optional, default is `keycloak`).

#### MONGO_USER

Specify the user for MongoDB database (optional, default is `keycloak`).

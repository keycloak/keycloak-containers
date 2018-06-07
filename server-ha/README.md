# Keycloak Docker image

Keycloak HA Server Docker image.

## Usage

Settings are same like in jboss/keycloak image.

## Expose on localhost

To be able to open Keycloak on localhost map port 8080 locally

    docker run -p 8080:8080 jboss/keycloak-ha


#### Example with PostgreSQL

##### Start a PostgreSQL instance

    docker run --name postgres -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -d postgres

##### Start a Keycloak instances

    docker run --name keycloak1 jboss/keycloak-ha
    docker run --name keycloak2 jboss/keycloak-ha

##### Docker Compose Example
    
    version: "3.2"
    services:
      keycloak:
        image: jboss/keycloak-ha:latest
        restart: always
        deploy:
          replicas: 2
        ports:
          - "8080:8080"
        networks:
          - devnet
      postgres:
        image: postgres:latest
        restart: always
        environment:
          POSTGRES_PASSWORD: password
          POSTGRES_USER: keycloak
          POSTGRES_DB: keycloak
        deploy:
          replicas: 1
          placement:
            constraints: [node.role == manager]
        networks:
          - devnet
    networks:
        devnet:
    
    
    
## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK
distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md
for selected images for more info.

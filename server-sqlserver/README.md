# Keycloak PostgreSQL

Extends the Keycloak docker image to use SQL Server

## Usage

### Environment variables

When starting the Keycloak instance you can pass a number of environment variables to configure how it connects to SQL Server. For example:

    docker run --name keycloak -e MSSQL_DATABASE=keycloak -e MSSQL_USER=keycloak -e MSSQL_PASSWORD=password jboss/keycloak-postgres

#### MSSQL_HOST

Specify name of SQL Server host. (Required, no default).

#### MSSQL_PORT

Specify name of SQL Server host. (optional, default is `1433`).

#### MSSQL_DATABASE

Specify name of SQL Server database (optional, default is `keycloak`).

#### MSSQL_USER

Specify user for SQL Server database (optional, default is `keycloak`).

#### MSSQL_PASSWORD

Specify password for SQL Server database (optional, default is `keycloak`).

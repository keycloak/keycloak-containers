# Keycloak with Oracle database
Example Docker file for Keycloak using an Oracle database

## Usage

### Start an Oracle database instance
First start an Oracle database instance using the official docker image:
```bash
docker run --name oracle -e ORACLE_PWD=oracle -d oracle/database:11.2.0.2-xe
```
Wait for the database to start, that is until you see:
```
#########################
DATABASE IS READY TO USE!
#########################
```

Keep in mind, though, that you have to build the image yourself, by following [these instructions](https://github.com/oracle/docker-images/blob/master/OracleDatabase/SingleInstance/README.md).

### Provide an Oracle JDBC driver
Due to the license issues, the driver file cannot be provided with this Keycloak image. You have to provide it yourself and mount it as a volume. You can download it [here](http://www.oracle.com/technetwork/database/features/jdbc/jdbc-ucp-122-3110062.html), or you can use the `jdbc-driver-downloader.sh` script provided with this server. The script usage can be found at:

```bash
./jdbc-driver-downloader.sh --help
```

### Start a Keycloak instance
Start a Keycloak instance that connects to the Oracle database instance running in previously started 'oracle' container:

```bash
docker run --name keycloak \
    --link oracle:oracle \
    -e DB_VENDOR=ORACLE \
    -e DB_ADDR=oracle \
    -e DB_DATABASE=XE \
    -e DB_USER=SYSTEM \
    -e DB_PASSWORD=oracle \
    -v ./ojdbc8.jar:/opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main/ojdbc8.jar \
    jboss/keycloak-oracle:4.0.0.Final
```

## Other details
This image extends the base [`jboss/keycloak`](https://github.com/jboss-dockerfiles/keycloak) image. Please refer to the [README.md](/../README.md) for selected images for more info.

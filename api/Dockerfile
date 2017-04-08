# docker build --pull=true -t postgrest:clevercloud .
FROM begriffs/postgrest:v0.3.2.0
MAINTAINER Francois-Guillaume Ribreau <docker@fgribreau.com>

ENV POSTGREST_VERSION 0.3.2.0
ENV POSTGREST_SCHEMA public
ENV POSTGREST_ANONYMOUS postgres
ENV POSTGREST_JWT_SECRET thisisnotarealsecret
ENV POSTGREST_MAX_ROWS 1000000
ENV POSTGREST_POOL 200
ENV POSTGREST_PORT 8080

CMD exec postgrest postgres://${PG_ENV_POSTGRES_USER}:${PG_ENV_POSTGRES_PASSWORD}@${PG_PORT_5432_TCP_ADDR}:${PG_PORT_5432_TCP_PORT}/${PG_ENV_POSTGRES_DB} \
              --port ${POSTGREST_PORT} \
              --schema ${POSTGREST_SCHEMA} \
              --anonymous ${POSTGREST_ANONYMOUS} \
              --pool ${POSTGREST_POOL} \
              --jwt-secret ${POSTGREST_JWT_SECRET} \
              --max-rows ${POSTGREST_MAX_ROWS}

EXPOSE 8080

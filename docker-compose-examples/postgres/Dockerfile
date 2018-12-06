FROM postgres:11

ADD create_schema.sh /docker-entrypoint-initdb.d/create_schema.sh
RUN chmod +x /docker-entrypoint-initdb.d/create_schema.sh
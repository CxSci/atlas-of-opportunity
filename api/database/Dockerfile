FROM postgres:alpine
WORKDIR /docker-entrypoint-initdb.d
COPY *.sql /docker-entrypoint-initdb.d/
ADD 1_init.sql /docker-entrypoint-initdb.d
ADD 2_copy.sql /docker-entrypoint-initdb.d
RUN chmod a+r /docker-entrypoint-initdb.d/*
EXPOSE 5432
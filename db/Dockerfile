FROM mysql:8.1

ENV MYSQL_ALLOW_EMPTY_PASSWORD=""
ENV MYSQL_DATABASE=dbvente

COPY dbvente.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
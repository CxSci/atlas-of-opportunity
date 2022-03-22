FROM python:3

# Install psql
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    apt-get clean && \
    rm -rf /var/cache/apt/lists

ADD ./requirements.txt .

RUN pip install -r requirements.txt

# env PGHOST "postgis"
# env PGPORT 5432
# env PGUSER "postgres"
# env PGPASSWORD "postgres"
# env PGDATABASE "dashboard"

ADD ./scripts/* /scripts/

# Run every .sh and .py file under /docker-entrypoint-scripts
CMD ["bash", "/scripts/init.sh"]

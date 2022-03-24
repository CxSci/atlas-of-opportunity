#! /usr/bin/env sh

# Wait until postgis service is running and postprocessor service has finished
# successfully.
scripts/dotenv.sh \
    python3 scripts/wait_for_postgresql.py \
    "SELECT to_regclass('public.dashboard_postprocessor');"

echo "Starting api service..."
python3 manage.py migrate --noinput && \
python3 manage.py loaddata initial.json --app api --format json && \
python3 manage.py runserver 0.0.0.0:8000

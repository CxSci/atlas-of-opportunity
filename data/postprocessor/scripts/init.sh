#!/usr/bin/env bash

# Wait for postgis server to be available
python3 /scripts/wait_for_postgresql.py "select true"

SENTINEL="dashboard_postprocessor"
CHECK_SQL="SELECT to_regclass('public.${SENTINEL}');"
MARK_FINISHED_SQL="CREATE TABLE ${SENTINEL}();"

if [[ $(psql -A -t -c "$CHECK_SQL") != "$SENTINEL" ]]; then
  echo "Sentinel table '${SENTINEL}' does not exist."
  echo "Running postprocessor entrypoint scripts..."
  # Execute docker entrypoint scripts
  #
  # - Execute .sh and .py files
  # - Look in subdirectories
  find /datasets/*/postprocessor-entrypoint-scripts -type f -print0 | while read -d $'\0' f; do
    case "$f" in
      *.sh)     echo "$0: running $f"; sh "$f" ;;
      *.sql)    echo "$0: running $f"; psql -f "$f"; echo ;;
      *.sql.gz) echo "$0: running $f"; gunzip -c "$f" | psql; echo ;;
      *.py)     echo "$0: running $f"; python3 "$f"; echo ;;
      *)        echo "$0: ignoring $f" ;;
    esac
    echo
  done

  echo "Finished running entrypoint scripts. Creating sentinel table to prevent future runs."
  psql -c "$MARK_FINISHED_SQL"
else
  echo "Sentinel table '${SENTINEL}' already exists."
  echo "Postprocessor exiting early."
fi

echo "Postprocessor finished. Shutting down."

#! /usr/bin/env bash

if [[ $# -lt 1 ]] ; then
  echo $0 command
  exit 1
fi

# TODO: Replace fragile check for "True"
if [[ $DEBUG == "True" ]]; then
  MODE=development
else
  MODE=production
fi
INITIAL_ENV=$(env)
declare -a ENV_FILES=(".env" ".env.${MODE}" ".env.${MODE}.local")

set -a

# Loop over files
for FILE in ${ENV_FILES[@]}; do
  # Check that a file exists
  if [ -f $FILE ]; then
    echo "Sourcing $FILE"
    source $FILE
  else
    echo "Couldn't find $FILE"
  fi
done

# Original env variables take precedence over any env files
echo "Reapplying origin env"
source <(echo -ne $INITIAL_ENV)

set +a
"${@:1}"

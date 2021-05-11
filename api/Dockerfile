FROM python:3-alpine

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./requirements.txt .

RUN \
    apk add --no-cache python3 postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc python3-dev musl-dev postgresql-dev && \
    pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

COPY . .

CMD [ "python", "app.py"]
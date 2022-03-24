FROM python:3

RUN adduser --system --no-create-home --disabled-password django

WORKDIR /usr/src/app

ADD ./requirements.txt .

RUN pip install -r requirements.txt

ADD . .

EXPOSE 8000

RUN chmod +x scripts/*
RUN chown django scripts/*

USER django

ENTRYPOINT ["scripts/entrypoint.sh"]

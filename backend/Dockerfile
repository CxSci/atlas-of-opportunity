FROM python:3

RUN adduser --system --no-create-home --disabled-password django

WORKDIR /usr/src/app

ADD ./requirements.txt .

RUN pip install -r requirements.txt

ADD . .

EXPOSE 8000

RUN chmod +x scripts/entrypoint.sh
RUN chown django scripts/entrypoint.sh

USER django

ENTRYPOINT ["scripts/entrypoint.sh"]

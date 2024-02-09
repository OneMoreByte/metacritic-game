FROM python:3.11-alpine AS builder

WORKDIR /app

ADD pyproject.toml poetry.lock README.md /app/

RUN apk add build-base libffi-dev

RUN pip install poetry
RUN poetry config virtualenvs.in-project true
RUN poetry install --no-root

FROM python:3.11-alpine
WORKDIR /app

COPY --from=builder /app /app
ADD . /app


RUN addgroup --gid 1000 scraper
RUN adduser scraper -h /app -u 1000 -G scraper -DH
USER 1000

CMD ["/app/.venv/bin/python", "-m", "scrape-metacritic"]

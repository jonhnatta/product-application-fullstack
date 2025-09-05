FROM python:3.11.9

WORKDIR /app

RUN pip install poetry

RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock* ./

RUN poetry install --only=main --no-root

COPY backend/ ./

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
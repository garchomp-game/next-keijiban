FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl netcat-traditional libpq-dev gcc \
 && rm -rf /var/lib/apt/lists/*

# Python deps (layer cache)
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# App sources
COPY backend /app
COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000
CMD ["/entrypoint.sh"]

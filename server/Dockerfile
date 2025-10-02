# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies and clean up in one layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r django && useradd -r -g django django

# Set work directory
WORKDIR /app

# Install dependencies
# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project and change ownership
COPY . .
RUN chown -R django:django /app

USER django

# Expose port 8000
EXPOSE 8000

# Run gunicorn
# The user running the container needs to run `python manage.py migrate`
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]

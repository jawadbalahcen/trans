
FROM python:3.11-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# RUN python manage.py makemigrations && python manage.py migrate
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
#!/bin/sh

# Wait for database to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
done
echo "PostgreSQL started"

# Make migrations
python manage.py makemigrations auth_app
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Start server
exec python manage.py runserver 0.0.0.0:8000 
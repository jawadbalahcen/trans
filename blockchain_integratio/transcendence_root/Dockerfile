# Base image - uses Python 3.11 slim version
FROM python:3.11-slim

# Sets /app as the working directory in the container
WORKDIR /app

# Copies requirements.txt from your local machine to the container
COPY app/pingpong/requirements.txt .

# Installs all Python packages listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copies your Django project from app/pingpong to the container
COPY app/pingpong .

# Opens port 8000 in the container
EXPOSE 8000

# Default command that runs when container starts
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

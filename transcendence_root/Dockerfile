# Use an official Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy the requirements file from app/pingpong
COPY app/pingpong/requirements.txt .

# Install Python dependencies
RUN apt-get update && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && \
    && rm -rf /var/lib/apt/lists/*

# Copy the Django project files into the container
COPY app/pingpong/ . 

# Expose the Django development server port
EXPOSE 8000

# Command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

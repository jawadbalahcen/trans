FROM python:3.11

ENV PYTHONUNBUFFERED=1

# Install netcat and dos2unix
RUN apt-get update && apt-get install -y netcat-openbsd dos2unix

WORKDIR /app

COPY ./pingpong/requirements.txt /app/
RUN pip install -r requirements.txt

COPY ./pingpong /app/

# Copy entrypoint script
COPY ./pingpong/entrypoint.sh /app/
# Fix permissions and line endings
RUN dos2unix /app/entrypoint.sh && \
    chmod 755 /app/entrypoint.sh

EXPOSE 8000

# Use entrypoint script
CMD ["/bin/sh", "/app/entrypoint.sh"] 
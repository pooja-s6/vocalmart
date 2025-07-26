# Use a Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install ffmpeg and system dependencies
RUN apt-get update && apt-get install -y ffmpeg gcc

# Copy requirements and app
COPY requirements.txt .
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose Flask port
EXPOSE 5000

# Run Flask app
CMD ["python", "app.py"]


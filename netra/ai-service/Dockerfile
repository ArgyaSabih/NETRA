FROM python:3.12-slim

WORKDIR /app

#install dependencies sklearn
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

#install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#copy source code
COPY . .

CMD ["python", "main.py"]

import time
import os
from celery import Celery
#from flask import Flask, request, jsonify

# Create a Celery application
broker_url = os.environ.get("CELERY_BROKER_URL")
app = Celery('tasks', broker=broker_url)
# server = Flask(__name__)

# @server.get("/api")
# def get_data
# @server.post("/api")

# Simulating a Celery task
@app.task
def process_message(message):
    # Simulate processing the message
    print("Processing:", message)
    time.sleep(1)

# Simulating users adding messages to the queue
    
if __name__ == '__main__':
    app.start()
    for i in range(5):
        message = f"Message {i}"
        # Instead of directly processing the message, send it as a Celery task
        process_message.delay(message)
        time.sleep(0.5)


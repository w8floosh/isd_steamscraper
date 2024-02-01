import time
from os import environ
from celery import Celery

broker_url = environ.get("CELERY_BROKER_URL")
app = Celery("tasks", broker=broker_url)


# Simulating a Celery task
@app.task
def process_message(message):
    # Simulate processing the message
    print("Processing:", message)
    time.sleep(1)


# Simulating users adding messages to the queue

if __name__ == "__main__":
    app.start()

    # load all app data and put in Redis cache store
    for i in range(5):
        message = f"Message {i}"
        # Instead of directly processing the message, send it as a Celery task
        process_message.delay(message)
        time.sleep(0.5)

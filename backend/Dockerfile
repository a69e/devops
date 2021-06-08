FROM python:3.6-slim
RUN mkdir -p /devops/backend
WORKDIR /devops/backend
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
CMD ["python3", "restapi.py"]
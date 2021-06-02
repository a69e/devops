FROM python:3.6-slim
COPY ./hello.py ./hello.py
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
CMD ["python3", "hello.py"]
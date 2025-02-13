FROM python:3.11-slim 
ENV PYTHONBUFFERED=1
WORKDIR /code
COPY backend/requirements.txt /code/requirements.txt
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

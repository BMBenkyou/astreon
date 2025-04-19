FROM python:3.11-slim 
ENV PYTHONBUFFERED=1
WORKDIR /code
COPY ./backend /code/backend
COPY backend/requirements.txt /code/requirements.txt
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8080
CMD ["bash", "-c", "source /code/.venv/bin/activate && python3 backend/manage.py runserver 0.0.0.0:8080"]

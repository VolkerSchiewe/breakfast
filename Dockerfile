# Use an official Python runtime as a parent image
FROM python:3.6

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

# Install pipenv
RUN pip install pipenv
RUN pipenv install --system

# Make port 80 available to the world outside this container
EXPOSE 8000
EXPOSE 5432

# Run app.py when the container launches
CMD ["python", "manage.py", "runserver", "localhost:8000"]

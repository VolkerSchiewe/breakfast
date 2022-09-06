FROM node:14-alpine AS node-build
RUN apk add g++ make py3-pip

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn build

FROM python:3.9.12-slim AS python-base
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        # deps for installing poetry
        curl \
        # deps for building python deps
        build-essential libpq-dev gcc libpq5
    # python
ENV PYTHONUNBUFFERED=1 \
    # prevents python creating .pyc files
    PYTHONDONTWRITEBYTECODE=1 \
    # pip
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # poetry
    # https://python-poetry.org/docs/configuration/#using-environment-variables
    POETRY_VERSION=1.1.12 \
    # make poetry install to this location
    POETRY_HOME="/opt/poetry" \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1 \
    # paths
    # this is where our requirements + virtual environment will live
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

# install poetry - respects $POETRY_VERSION & $POETRY_HOME
RUN curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python

# copy project requirement files here to ensure they will be cached.
WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml ./

# install runtime deps - uses $POETRY_VIRTUALENVS_IN_PROJECT internally
RUN poetry install --no-dev


# `development` image is used during development / testing
FROM python-base as development

# quicker install as runtime deps are already installed
RUN poetry install
WORKDIR /app


# `production` image used for runtime
FROM python-base as production

COPY ./ /app/
# COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH
COPY --from=node-build /app/static/build/ /app/static/build/
WORKDIR /app
RUN python manage.py collectstatic --no-input
CMD ["daphne", "breakfast.asgi:application", "--port", "8080", "--bind","0.0.0.0"]
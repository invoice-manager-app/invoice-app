FROM node:lts-alpine
RUN apk add git  # For developing through the container

WORKDIR /app
# COPY ./frontend/package*.json ./frontend

COPY ./frontend .
RUN npm install


EXPOSE 3000
CMD [ "npm", "run", "dev" ]

FROM node:25

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 4200

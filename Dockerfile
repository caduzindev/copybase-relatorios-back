FROM node:18-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json .
COPY ./src src
COPY ./static static

RUN chmod -R 777 static 

RUN npm ci
RUN npx tsc

ENV PORT=3005
ENV SWAGGER_BASE_SERVER=http://localhost:3005
ENV SWAGGER_DOCS_PATH=/app/src/presentation/routes/swagger

EXPOSE 3005
CMD ["npm", "start"]

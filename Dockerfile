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

EXPOSE 3005
CMD ["npm", "start"]

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache build-base python3

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]

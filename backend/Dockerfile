FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g nodemon && npm install

COPY . .

EXPOSE 5003

CMD ["nodemon", "--inspect", "src/app.js"]

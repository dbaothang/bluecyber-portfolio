FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g nodemon && npm install --legacy-peer-deps

COPY . .

EXPOSE 5003

CMD ["npm", "start"]

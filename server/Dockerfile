# DOCKER FILE NODE SERVER
FROM node:18-bullseye

WORKDIR /usr/src/app

# Install build dependencies required by mysql2 / bcryptjs
RUN apt-get update \
  && apt-get install -y python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

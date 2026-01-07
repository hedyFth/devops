# Backend Dockerfile (Node + Express)
FROM node:20-alpine

WORKDIR /app

# installer deps
COPY package*.json ./
RUN npm ci --omit=dev

# copier le code
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]

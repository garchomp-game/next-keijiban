FROM node:22-alpine
WORKDIR /app

# Install deps using lockfile if存在
COPY frontend/package*.json ./
RUN npm ci || npm install

# Copy sources (dev では volume で上書きされる)
COPY frontend .
EXPOSE 3000
CMD ["npm", "run", "dev"]

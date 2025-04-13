FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY .env .
COPY .env.example .env.example
COPY .env.development .env.development
COPY .env.production .env.production
COPY .env.test .env.test
COPY .env.staging .env.staging
COPY .env.local .env.local
COPY .env.development.local .env.development.local

RUN npm install --production --silent
RUN npm run build
RUN npm prune --production
RUN npm cache clean --force
RUN rm -rf /tmp/* /var/tmp/* /root/.npm /root/.node-gyp /root/.cache /usr/local/share/.cache

EXPOSE 3000
CMD ["node", "dist/index.js"]
# docker build -t auth-service:latest .
# docker run -d --name auth-service -p 3000:3000 auth-service:latest
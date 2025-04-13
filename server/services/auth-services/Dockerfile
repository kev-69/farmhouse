FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY .env .

RUN npm install --silent && npm install typescript --save-dev --silent
RUN npm run build
RUN npm prune --production
RUN npm cache clean --force
RUN rm -rf /tmp/* /var/tmp/* /root/.npm /root/.node-gyp /root/.cache /usr/local/share/.cache

EXPOSE 3000
CMD ["node", "dist/index.js"]
# docker build -t auth-service:latest .
# docker run -d --name auth-service -p 3000:3000 auth-service:latest
FROM node:slim
RUN mkdir -p /devops/frontend
WORKDIR /devops/frontend
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
# for dev purpose:
CMD ["npm", "start"]
FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g nodemon ts-node

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]

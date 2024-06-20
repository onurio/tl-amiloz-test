#!/bin/sh

# Run migrations
npx sequelize-cli db:migrate --migrations-path src/migrations --config src/config/config.json

# Start the application with nodemon
nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts

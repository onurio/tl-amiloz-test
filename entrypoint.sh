#!/bin/sh

# Compile TypeScript to JavaScript for migrations
npm run build

# Run migrations
npx sequelize-cli-typescript db:migrate


# Start the application with nodemon
nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts

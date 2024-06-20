#!/bin/sh

# This is for development purposes
npm install

# Compile TypeScript to JavaScript for migrations
npm run build

# Run migrations
npx sequelize-cli-typescript db:migrate


npm run dev
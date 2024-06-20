#!/bin/bash

if [ ! -f .env ]; then
    touch .env
fi

SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

if grep -q "^AUTH_SECRET=" .env; then
    sed -i '' "s/^AUTH_SECRET=.*/AUTH_SECRET=$SECRET/" .env
else
    echo "AUTH_SECRET=$SECRET" >> .env
fi

echo "AUTH_SECRET has been set in the .env file"
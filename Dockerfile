FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json ./

# Install app dependencies
RUN npm install

RUN npm install -g nodemon ts-node


# Bundle app source
COPY . .

# Set the entry point script
ENTRYPOINT ["/app/entrypoint.sh"]

EXPOSE 3000

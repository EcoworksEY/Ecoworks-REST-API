# Build environment
FROM node:18.4.0-alpine as build

# Working directory
WORKDIR /app

# Cppy node
COPY package.* .

# Installing App dependencies
# Updatig npm on build side
RUN npm install -g npm@latest

# Update all npm packages locally
RUN npm install
# Cop all the remaining code
COPY . .

# Expose the right port
EXPOSE 8080

# Run the required cmd command to execute this
CMD ["npm", "start"]

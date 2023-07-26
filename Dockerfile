# Build environment
FROM node:18.4.0-alpine as build

# Please do not do this.
ENV PORT = 8080
ENV DB_USER = postgres
ENV DB_PASSWORD = Ecoworks2023
ENV DB_HOST_LOCALHOST = localhost
ENV DB_HOST_LOCALHOST_DOCKER = host.docker.internal
ENV EC2_USER = ec2-user
ENV EC2_GATEWAY_HOST = ec2-3-26-222-246.ap-southeast-2.compute.amazonaws.com
ENV DB_HOST = ecoworks-db.caigpsr8sbmy.ap-southeast-2.rds.amazonaws.com
ENV DB_PORT = 5432
ENV DB_DATABASE = ecoworks-db
ENV AWS_REGION = us-east-1
ENV COGNITO_USER_POOL_ID = us-east-1_mugXIoZ7Q
ENV COGNITO_CLIENT_ID = 2a7jbeekm90f2s1bhol6ima33j
ENV COGNITO_CLIENT_SECRET = grm97e529rijh8pb4640m2jbe97nr099iatgisqv7ltormc0kut

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

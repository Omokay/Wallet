FROM node:16
# Create app directory in the image
WORKDIR /src

# Install app dependencies
COPY package*.json ./
RUN npm install

# RUN npm ci --only=production

# Bundle app source
COPY . .

# Port Mappings
EXPOSE 2023

# bcrypt compiled on OSX will not quite work on Linux, so
# Install bcrypt
RUN npm install bcrypt


# CMD commands
CMD [ "npm", "start" ]

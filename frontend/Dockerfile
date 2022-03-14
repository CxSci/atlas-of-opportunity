FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# Do this before adding other files so npm install is only re-run on docker
# image builds when project dependencies have changed, not when just any file
# has changed.
COPY package*.json ./
RUN npm clean-install

# Add the rest of the project
ADD . .

EXPOSE 3000

# Run the server
CMD ["npm", "start"]

FROM node:12-alpine as build-stage

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# Do this before adding other files so npm install is only re-run on docker
# image builds when project dependencies have changed, not when just any file
# has changed.
COPY package.*json ./
RUN npm install

# Add the rest of the project
ADD . .

RUN npm run build

FROM nginx:1-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

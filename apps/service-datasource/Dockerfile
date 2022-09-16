FROM node:16.17-alpine
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run

RUN mkdir -p /nest

WORKDIR /nest

COPY package.json yarn.lock ./

RUN yarn global add @nestjs/cli

RUN yarn install --production=false

# Bundle app source
COPY . .

# Build production files
RUN nest build service-datasource

CMD ["node", "dist/apps/api-admin/main.js"]

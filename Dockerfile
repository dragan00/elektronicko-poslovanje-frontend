FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "yarn", "start" ]

# FROM node:14-alpine AS builder
# ENV NODE_ENV production
# WORKDIR /app
# COPY package.json .
# COPY yarn.lock .
# RUN yarn install --production
# COPY . .
# RUN yarn build

# FROM nginx:1.21.0-alpine AS production
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
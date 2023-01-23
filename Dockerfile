FROM node:18-alpine
WORKDIR /todo-app-server
EXPOSE 3000
COPY . .
RUN ["npm", "install"]
CMD ["npm", "run", "start"]
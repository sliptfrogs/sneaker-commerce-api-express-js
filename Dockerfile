# 1. Use official Node.js image
FROM node:24

# 2. Set working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the project files
COPY . .

# 6. Expose port (same as your app)
EXPOSE 3000

# 7. Command to run your app
CMD ["node", "nodemon","app.js"]

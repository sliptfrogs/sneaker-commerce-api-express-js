# 1. Use official Node.js image
FROM node:22.21.1

# 2. Set working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install only production dependencies
RUN npm ci --only=production

# 5. Copy the rest of the project files
COPY . .

# 6. Expose port (same as your app)
EXPOSE 3000

# 7. Command to run your app in production
CMD ["node", "app.js"]

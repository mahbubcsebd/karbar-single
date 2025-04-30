# Step 1: Build stage - Install dependencies and build the app
FROM node:20.17.0 AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Step 4: Install all dependencies (including devDependencies)
RUN npm ci

# Step 5: Copy the entire app source code
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Prune devDependencies to reduce image size
RUN npm prune --production

# Step 8: Runtime stage - Use a smaller base image for production
FROM node:20.17.0 AS production

# Step 9: Set working directory
WORKDIR /app

# Step 10: Copy production dependencies and build output from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

# Step 11: Expose the port Next.js will run on
EXPOSE 3000

# Step 12: Set environment variables for production
ENV NODE_ENV production

# Step 13: Start the app using Next.js
CMD ["npm", "run", "start"]

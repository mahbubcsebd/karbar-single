#!/bin/bash

# Define variables
REMOTE_USER="root"
REMOTE_HOST="194.238.16.105"
REMOTE_PORT="22"
REMOTE_DIR="/var/www/furnitobd.com"

# Define the new port and api Url
NEW_PORT="5004"
NEW_API_URL="https://admin.furnitobd.com/api"
#NEW_API_URL=$APP_HOSTNAME"/api"

# Update the package.json file with new port using jq
echo "Updating package.json with new port..."

jq --arg port "$NEW_PORT" '
  .scripts.dev = "next dev -p \($port)" |
  .scripts.start = "next start -p \($port)" |
  .scripts.server = "json-server --watch db.json --port \($port)"
' package.json > tmp.json && mv tmp.json package.json

# Confirm the changes
echo "Updated .env with port $NEW_PORT:"
cat package.json

# Update .env with new API base URL
echo "Updating .env with new API base URL..."
#sed -i "s|^APP_HOSTNAME.*|APP_HOSTNAME=$NEW_API_URL|" .env
sed -i "s|^NEXT_PUBLIC_API_BASE_URL=.*|NEXT_PUBLIC_API_BASE_URL=$NEW_API_URL|" .env

# Confirm the changes
echo "Updated package.json with port $NEW_API_URL:"
cat .env

# Build the Next.js project
echo "Building the Next.js project..."
npm run build
npm cache clean --force

# Archive the built project
echo "Archiving the built project..."
tar -czf nextjs-app.tar.gz .next public package.json next.config.mjs .env # Adjust files as per your project structure

# Copy the archive to the remote server
echo "Copying files to remote server..."
#scp -i "$SSH_KEY" nextjs-app.tar.gz "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
rsync -avz -e "ssh" nextjs-app.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:$REMOTE_DIR;

# SSH into the remote server, extract the files, install dependencies, and start the app
echo "Connecting to remote server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF

  cd "$REMOTE_DIR"

  # Extract the files
  echo "Extracting files..."
  tar -xzf nextjs-app.tar.gz

  # Cleanup
  echo "Cleaning up..."
  rm nextjs-app.tar.gz

  # Check if next is installed and install if not
  if ! command -v next &> /dev/null; then
    echo "Next.js not found. Installing Next.js..."
    npm i next
  else
    echo "Next.js is already installed."
  fi

  # Restart the service
  sudo systemctl restart furnitobd.service

  echo "Deployment completed successfully."
EOF

if [ $? -ne 0 ]; then
    echo "Remote execution failed. Aborting deployment."
    exit 1
fi

echo "Deployment script finished."
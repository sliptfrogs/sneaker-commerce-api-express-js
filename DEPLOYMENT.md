# Deployment Guide - Multi-Environment Setup

This guide explains how to deploy your Sneaker API with the new multi-environment profile system (development & production).

## 📋 Overview

- `.env.dev` - Development configuration
- `.env.production` - Production configuration
- Both files are **NOT committed** to git (in `.gitignore`)
- Environment variables are stored as **GitHub Secrets**
- CI/CD pipeline creates `.env` files dynamically from secrets

## 🔐 Setup GitHub Secrets

GitHub Secrets allow you to securely store sensitive data without committing them to the repository.

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**

### Step 2: Create Production Secrets

For **production deployment**, create these secrets:

```
PROD_DB_HOST
PROD_DB_USER
PROD_DB_PASSWORD
PROD_DB_NAME
PROD_DB_PORT
PROD_DB_SSL
PROD_JWT_ACCESS_SECRET
PROD_JWT_ACCESS_EXPIRED_IN
PROD_JWT_REFRESH_SECRET
PROD_JWT_REFRESH_EXPIRED_IN
PROD_BCRYPT_SALT_ROUNDS
PROD_CLOUDINARY_CLOUD_NAME
PROD_CLOUDINARY_API_KEY
PROD_CLOUDINARY_API_SECRET
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
VPS_HOST
VPS_USER
VPS_SSH_KEY
```

### Step 3: Create Development Secrets (Optional)

For **development/testing** in CI pipeline:

```
DEV_DB_HOST
DEV_DB_USER
DEV_DB_PASSWORD
DEV_DB_NAME
DEV_DB_PORT
DEV_DB_SSL
DEV_JWT_ACCESS_SECRET
DEV_JWT_ACCESS_EXPIRED_IN
DEV_JWT_REFRESH_SECRET
DEV_JWT_REFRESH_EXPIRED_IN
DEV_CLOUDINARY_CLOUD_NAME
DEV_CLOUDINARY_API_KEY
DEV_CLOUDINARY_API_SECRET
```

## 🚀 Updated CI/CD Workflow

### Updated `.github/workflows/ci.yml`

This workflow runs tests on every push/PR:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 20

      # Create .env.dev from secrets for testing
      - name: Create .env.dev for testing
        run: |
          cat > .env.dev << EOF
          PORT=3001
          DB_HOST=${{ secrets.DEV_DB_HOST || 'localhost' }}
          DB_USER=${{ secrets.DEV_DB_USER || 'test' }}
          DB_PASSWORD=${{ secrets.DEV_DB_PASSWORD || 'test' }}
          DB_NAME=${{ secrets.DEV_DB_NAME || 'test_db' }}
          DB_PORT=5432
          DB_SSL=false
          JWT_ACCESS_SECRET=${{ secrets.DEV_JWT_ACCESS_SECRET || 'dev-secret' }}
          JWT_ACCESS_EXPIRED_IN="15m"
          JWT_REFRESH_SECRET=${{ secrets.DEV_JWT_REFRESH_SECRET || 'dev-refresh' }}
          JWT_REFRESH_EXPIRED_IN="7d"
          BCRYPT_SALT_ROUNDS=10
          CLOUDINARY_CLOUD_NAME=${{ secrets.DEV_CLOUDINARY_CLOUD_NAME }}
          CLOUDINARY_API_KEY=${{ secrets.DEV_CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET=${{ secrets.DEV_CLOUDINARY_API_SECRET }}
          NODE_ENV=development
          EOF

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Format
        run: npm run format

      - name: Run tests
        run: npm test
```

### Updated `.github/workflows/cd.yml`

This workflow deploys to production only on successful CI:

```yaml
name: CD - Deploy to VPS

on:
  workflow_run:
    workflows: ['CI']
    types:
      - completed

jobs:
  deploy:
    if: |
      github.event.workflow_run.conclusion == 'success' &&
      github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Create .env.production from secrets
      - name: Create .env.production
        run: |
          cat > .env.production << EOF
          PORT=3001
          DB_HOST=${{ secrets.PROD_DB_HOST }}
          DB_USER=${{ secrets.PROD_DB_USER }}
          DB_PASSWORD=${{ secrets.PROD_DB_PASSWORD }}
          DB_NAME=${{ secrets.PROD_DB_NAME }}
          DB_PORT=${{ secrets.PROD_DB_PORT }}
          DB_SSL=${{ secrets.PROD_DB_SSL }}
          JWT_ACCESS_SECRET=${{ secrets.PROD_JWT_ACCESS_SECRET }}
          JWT_ACCESS_EXPIRED_IN="15m"
          JWT_REFRESH_SECRET=${{ secrets.PROD_JWT_REFRESH_SECRET }}
          JWT_REFRESH_EXPIRED_IN="7d"
          BCRYPT_SALT_ROUNDS=${{ secrets.PROD_BCRYPT_SALT_ROUNDS }}
          CLOUDINARY_CLOUD_NAME=${{ secrets.PROD_CLOUDINARY_CLOUD_NAME }}
          CLOUDINARY_API_KEY=${{ secrets.PROD_CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET=${{ secrets.PROD_CLOUDINARY_API_SECRET }}
          NODE_ENV=production
          EOF

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/sneaker-api:latest

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/sneaker-api
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/sneaker-api:latest
            docker compose down
            docker compose up -d
            echo "Deployment complete!"
```

## 📝 How It Works

```
Developer Push
    ↓
GitHub Actions CI triggered
    ↓
Creates .env.dev from DEV_* secrets
    ↓
Runs linting, formatting, tests
    ↓
CI passes
    ↓
CD workflow triggered
    ↓
Creates .env.production from PROD_* secrets
    ↓
Builds Docker image with .env.production
    ↓
Pushes to Docker Hub
    ↓
Deploys to VPS with production env
```

## 🐳 Docker Deployment

### In Docker Container

The Dockerfile uses `npm start` which:

1. Sets `NODE_ENV=production`
2. App loads `.env.production`
3. Connects to production database

```dockerfile
CMD ["npm", "start"]
```

### Docker Compose

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: always
    networks:
      - sneaker-network

networks:
  sneaker-network:
    driver: bridge
```

## 🔄 Deployment Workflow

### For Development Changes (develop branch)

```bash
git checkout develop
git commit -m "Fix: some feature"
git push origin develop
```

- CI runs with `DEV_*` secrets
- Tests on mock/dev database
- No automatic deployment

### For Production Release (main branch)

```bash
git checkout main
git merge develop
git push origin main
```

- CI runs with `DEV_*` secrets
- Tests pass
- CD automatically triggers
- Uses `PROD_*` secrets
- Deploys to VPS

## 🔐 Security Best Practices

✅ **DO:**

- Store all secrets in GitHub Secrets
- Use different secrets for dev/production
- Rotate secrets periodically
- Use strong, unique passwords
- Keep SSH keys secure

❌ **DON'T:**

- Commit `.env*` files to git
- Store secrets in code
- Share secrets publicly
- Use the same secrets for dev/prod
- Hardcode sensitive values

## 📋 GitHub Secrets Checklist

- [ ] PROD_DB_HOST
- [ ] PROD_DB_USER
- [ ] PROD_DB_PASSWORD
- [ ] PROD_DB_NAME
- [ ] PROD_JWT_ACCESS_SECRET
- [ ] PROD_JWT_REFRESH_SECRET
- [ ] PROD_CLOUDINARY_CLOUD_NAME
- [ ] PROD_CLOUDINARY_API_KEY
- [ ] PROD_CLOUDINARY_API_SECRET
- [ ] DOCKERHUB_USERNAME
- [ ] DOCKERHUB_TOKEN
- [ ] VPS_HOST
- [ ] VPS_USER
- [ ] VPS_SSH_KEY

## 🚨 Troubleshooting

### Deployment fails with "env not found"

**Problem:** `.env.production` not created in CI
**Solution:** Ensure all PROD\_\* secrets are set in GitHub Settings

### Wrong database connected

**Problem:** Using dev database in production
**Solution:** Check `NODE_ENV=production` in CD workflow

### Port already in use on VPS

```bash
# SSH into VPS
ssh user@host
docker ps
docker stop container_id
```

### Need to rollback deployment

```bash
# SSH into VPS and pull previous image
docker pull username/sneaker-api:previous-tag
docker compose down
docker compose up -d
```

---

**Summary:** The multi-environment setup actually improves CI/CD by:

1. ✅ Keeping secrets secure (not in git)
2. ✅ Clear separation of dev/prod configs
3. ✅ Easy to manage multiple deployments
4. ✅ Following industry best practices

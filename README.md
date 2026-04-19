# 🐳 Sneaker Commerce API

---

## 🔄 Get Latest Code (Git)

### 1. Go to your project folder

```bash
cd your-project-folder
```

### 2. Pull latest code from remote

```bash
git pull origin main
```

> If your branch is `master` instead of `main`:

```bash
git pull origin master
```

---

## 📌 What this does

* Fetches latest commits from GitHub
* Merges them into your local branch
* Updates your project to the newest version

---

## 🧠 Useful Git checks

Check status:

```bash
git status
```

View recent commits:

```bash
git log --oneline -5
```

---

## ⚠️ If you have local changes

### Option 1: Keep changes

```bash
git stash
git pull origin main
git stash pop
```

### Option 2: Remove local changes

```bash
git reset --hard
git pull origin main
```

---

## 🐳 After pulling code (Docker)

Rebuild containers:

```bash
docker-compose down
docker-compose up -d --build
```

---

## 🚀 Quick Start (Docker)

A modern Express.js backend for Sneaker Commerce, fully containerized using Docker + Docker Compose.

### 1. Build and start all services

```bash
docker-compose up -d --build
```

### 2. Check running containers

```bash
docker-compose ps
```

### 3. View logs

```bash
# All services
docker-compose logs -f

# API only
docker-compose logs -f api

# Database only
docker-compose logs -f postgres
```

---

## 🌐 API Info

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Base URL

```
http://localhost:3000/v1/api
```

---

## 🛑 Stop Services

### Stop containers

```bash
docker-compose down
```

### Stop + delete database data (reset everything)

```bash
docker-compose down -v
```

⚠️ This will permanently delete PostgreSQL data.

---

## 🔁 Rebuild Project

If something breaks or DB changes:

```bash
docker-compose down -v
docker-compose up -d --build
```

---

## ⚙️ Important Notes

* Use `postgres` as DB host inside Docker (NOT `localhost`)
* Ensure `.env` file exists if required
* PostgreSQL data is stored in a Docker volume (persistent)
* API runs on port `3000`

---

## 🧠 Troubleshooting

If DB connection fails:

```bash
docker-compose down -v
docker-compose up --build
```

---

## 📦 Services

| Service  | Description         |
| -------- | ------------------- |
| api      | Express.js backend  |
| postgres | PostgreSQL database |

---

## ❤️ Author

Built for Sneaker Commerce API

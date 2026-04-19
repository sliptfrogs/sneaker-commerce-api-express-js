# 🐳 Sneaker Commerce API

A modern Express.js backend for Sneaker Commerce, fully containerized with **Docker + Docker Compose**.

---

## 🚀 Quick Start

### Start all services

```bash
docker-compose up -d --build
Check running containers
Bashdocker-compose ps
View Logs
Bash# All services
docker-compose logs -f

# API logs only
docker-compose logs -f api

# PostgreSQL logs only
docker-compose logs -f postgres
API Health Check
Bashcurl http://localhost:3000/health
Expected Response:
JSON{
  "status": "ok"
}
API Base URL
texthttp://localhost:3000/v1/api

🛑 Stop the Services
Stop containers
Bashdocker-compose down
Stop and reset everything (Clear Database)
Bashdocker-compose down -v
⚠️ Warning: This will delete all PostgreSQL data.
Rebuild from scratch
Bashdocker-compose down -v
docker-compose up -d --build

⚠️ Important Notes

Use postgres as the database host (NOT localhost)
Make sure a .env file exists if required
PostgreSQL data is persisted using Docker volume
The API runs on port 3000


🧠 Troubleshooting
If the API cannot connect to the database:
Bashdocker-compose down -v
docker-compose up --build

📦 Services

















ServiceDescriptionapiExpress.js backendpostgresPostgreSQL database

Made with ❤️ for Sneaker Commerce API
text---

**How to use:**

1. Copy everything above
2. Open your project folder
3. Create or replace the file named `README.md`
4. Paste the content and save

You're all set! This is a complete, single-file README.md.

Let me know if you want to add more sections like Environment Variables, API Endpoints, or Contributing.

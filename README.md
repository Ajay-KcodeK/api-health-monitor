# 🔍 API Health Monitor

A full-stack real-time API monitoring dashboard built with **Spring Boot** and **React TypeScript**.

![Dashboard Preview](screenshots/dashboard.png)

## 🌐 Live Demo
- **Frontend:** https://your-frontend.onrender.com
- **Backend API:** https://your-backend.onrender.com/api/health/ping

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with Spring Security
- 📡 **Real-time Dashboard** — WebSocket updates without page refresh
- ⏱️ **Auto Health Checks** — Every 60 seconds via Spring Scheduler
- 📊 **Status Tracking** — UP / DOWN / SLOW / PENDING detection
- 📈 **Response Time Charts** — Historical graphs with Recharts
- 📧 **Email Alerts** — Instant DOWN and recovery notifications
- 🤖 **AI Insights** — OpenAI-powered endpoint analysis
- 🐳 **Docker Deployment** — Containerized with multi-stage builds

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 17 + Spring Boot 3 | REST API framework |
| Spring Security + JWT | Authentication |
| Spring Scheduler | Auto health checks |
| Spring WebSocket (STOMP) | Real-time updates |
| JPA / Hibernate | Database ORM |
| MySQL (Aiven Cloud) | Production database |
| JavaMailSender | Email alerts |
| OpenAI API | AI insights |
| Docker | Containerization |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| STOMP.js | WebSocket client |
| Recharts | Response time graphs |
| React Router v7 | Navigation |

---

## 🏗️ Architecture
```
┌─────────────────┐     JWT      ┌──────────────────┐
│   React + TS    │ ──────────▶  │  Spring Boot API  │
│   (Render CDN)  │ ◀────────── │  (Render Docker)  │
│                 │  WebSocket   │                   │
└─────────────────┘             └────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   MySQL (Aiven)      │
                              │   Cloud Database     │
                              └─────────────────────┘
```

---

## 🗄️ Database Schema
```sql
users
├── id, name, email, password, created_at

api_endpoints  
├── id, name, url, check_interval, user_id, created_at

health_checks
├── id, endpoint_id, status, response_time, status_code, checked_at
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 17+
- Node.js 20+
- MySQL 8+
- Maven

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/api-health-monitor.git
cd api-health-monitor/backend

# Configure application.properties
cp src/main/resources/application.properties.example \
   src/main/resources/application.properties
# Edit with your MySQL credentials

# Run
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend

# Create env file
echo "REACT_APP_API_URL=http://localhost:8080" > .env

# Install and run
npm install
npm start
```

### Docker Setup
```bash
# Run everything with Docker
docker-compose up --build
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login + get JWT |
| GET | `/api/endpoints` | ✅ | List endpoints |
| POST | `/api/endpoints` | ✅ | Add endpoint |
| DELETE | `/api/endpoints/{id}` | ✅ | Delete endpoint |
| GET | `/api/endpoints/summary` | ✅ | Dashboard summary |
| GET | `/api/health/history/{id}` | ✅ | Check history |
| GET | `/api/insights/{id}` | ✅ | AI insights |
| GET | `/api/health/ping` | ❌ | Health ping |

---

## 📦 Deployment

### Environment Variables — Backend (Render)
```
SPRING_PROFILES_ACTIVE = prod
DB_HOST                = your-aiven-host
DB_PORT                = your-aiven-port
DB_NAME                = api_health_monitor
DB_USERNAME            = your-db-user
DB_PASSWORD            = your-db-password
JWT_SECRET             = your-64-char-secret
MAIL_USERNAME          = your@gmail.com
MAIL_PASSWORD          = your-app-password
CORS_ALLOWED_ORIGINS   = https://your-frontend.onrender.com
OPENAI_API_KEY         = sk-your-key
```

### Environment Variables — Frontend (Render)
```
REACT_APP_API_URL = https://your-backend.onrender.com
```

---

## 📸 Screenshots

| Login | Dashboard | AI Insights |
|-------|-----------|-------------|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) | ![AI](screenshots/ai-insights.png) |

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [yourprofile](https://linkedin.com/in/yourprofile)
- Fiverr: [yourprofile](https://fiverr.com/yourprofile)

---

## 📄 License

MIT License — free to use for portfolio and learning purposes.

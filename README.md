# 🌍 ORBIT – English Self-Learning Web Application

ORBIT is a full-stack web application that provides a **free English self-learning platform for students**.  
The project focuses on **secure authentication**, **scalable architecture**, and a **modern frontend experience**, making it suitable both for real usage and as a portfolio project.

---

## 🚀 Main Features

### 🔐 Secure Authentication System
- **JWT-based Authentication** with HttpOnly cookies for enhanced security
- **Refresh Token Mechanism** with Redis-backed token revocation
- **Role-Based Authorization** (USER, ADMIN roles)
- **Email Verification** with 20-character activation key system
- Automatic token refresh via Angular HTTP Interceptors
- Stateless backend architecture using Spring Security

### 📚 English Learning Modules
- **Vocabulary Learning System**
  - Create and manage custom vocabulary topics
  - Interactive flashcard-based learning
  - Personal vocabulary library organization
  - Topic categorization and management  

- **Progressive Learning Flow**
  - Gamified learning experience with space-themed UI
  - Track learning progress across topics
  - Self-paced vocabulary acquisition

### 🎨 Modern User Experience
- Responsive design for desktop and mobile devices
- Space-themed UI with smooth animations
- Intuitive navigation with protected routes
- Real-time toast notifications for user feedback
- 404 error page with creative design

---

## 🛠 Tech Stack

### Backend
- **Java 17** - Modern Java LTS version
- **Spring Boot** - Application framework
- **Spring Security** - Authentication & authorization
- **JWT (Nimbus)** - Token-based authentication
- **JPA / Hibernate** - ORM for database operations
- **MySQL** - Primary database
- **Redis** - Token storage and session management
- **Docker** - Containerization

### Frontend
- **Angular 21** - Modern web framework with signals
- **TypeScript 5.9** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Tailwind CSS 4** - Utility-first CSS framework
- **FontAwesome** - Icon library
- **Vitest** - Testing framework

### Development Tools
- **Angular CLI** - Development tooling
- **PostCSS** - CSS processing
- **Prettier** - Code formatting
- **npm** - Package management

---

## 🏗 Architecture Overview

### Authentication Flow
- **Access Token**: Short-lived JWT stored in HttpOnly Cookie
- **Refresh Token**: Stored and managed in Redis with revocation support
- **Security**: Stateless API with Spring Security Resource Server
- **Frontend**: Angular interceptors handle authentication & refresh flow automatically

### Project Structure
```
orbit/
├── src/
│   ├── app/
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication (login, register, activate)
│   │   │   └── learn-vocabulary/  # Vocabulary learning features
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Shared components (toast, not-found)
│   │   └── home/              # Landing page
│   └── environments/          # Environment configs
└── public/                    # Static assets
```

---

## ✨ Highlights

- JWT authentication with **HttpOnly cookies**
- **Refresh Token** mechanism with Redis revocation
- Stateless backend using Spring Security
- Automatic token refresh via Angular HTTP Interceptors
- Clean and modular architecture (Backend & Frontend separated)
- Dockerized infrastructure
- Modern Angular features (Standalone components, Signals)
- Space-themed UI with smooth animations

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js and npm
- Docker and Docker Compose
- MySQL
- Redis

### 1. Clone Repository

```bash
git clone https://github.com/lightningflashh/orbit.git
cd orbit
```

---

### 2. Start Infrastructure (MySQL + Redis)

```bash
docker-compose up -d
```

---

### 3. Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at:

```
http://localhost:8099
```

---

### 4. Run Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend runs at:

```
http://localhost:4200
```

---

## 🔐 Authentication Flow

1. User registers → Email verification required
2. User enters 20-character activation key → Account activated
3. User logs in → Backend issues JWT Access Token & Refresh Token
4. Access Token stored in HttpOnly Cookie
5. Frontend sends requests with `withCredentials`
6. Token expired → Interceptor automatically calls `/api/refresh`
7. Refresh token validated in Redis → New access token issued
8. Logout → Refresh token revoked from Redis

---

## 📌 Project Purpose

This project is built as:

- A **real-world authentication system example**
- A **full-stack portfolio project** showcasing modern web development practices
- A foundation for extending English learning features
- A demonstration of **secure token management** with JWT and Redis
- An example of **Angular 21** modern features (Signals, Standalone Components)

---

## 📄 License

This project is for **educational and portfolio purposes**.

---

## 👨‍💻 Author

Built with ❤️ by **lightningflashh**

---

**🌟 Master English In Orbit!**
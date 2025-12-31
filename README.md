# 🌍 ORBIT – English Self-Learning Web Application

ORBIT is a full-stack web application that provides a **free English self-learning platform for students**.  
The project focuses on **secure authentication**, **scalable architecture**, and a **modern frontend experience**, making it suitable both for real usage and as a portfolio project.

---

## ✨ Highlights

- JWT authentication with **HttpOnly cookies**
- **Refresh Token** mechanism with Redis revocation
- Stateless backend using Spring Security
- Automatic token refresh via Angular HTTP Interceptors
- Clean and modular architecture (Backend & Frontend separated)
- Dockerized infrastructure

---

## 🧩 Core Features

- User authentication (login / logout)
- Role-based authorization
- Secure token handling (Access Token + Refresh Token)
- English learning modules (extendable)
- Responsive UI for desktop and mobile

---

## 🛠 Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT (Nimbus)
- JPA / Hibernate
- MySQL
- Redis
- Docker

### Frontend

- Angular
- TypeScript
- RxJS
- Bootstrap

---

## 🏗 Architecture Overview

- **Access Token**: Short-lived JWT stored in HttpOnly Cookie
- **Refresh Token**: Stored and managed in Redis
- **Security**: Stateless API with Spring Security Resource Server
- **Frontend**: Angular interceptors handle authentication & refresh flow automatically

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-username/orbit.git
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
ng serve (--configuration=development)
```

Frontend runs at:

```
http://localhost:4200
```

---

## 🔐 Authentication Flow

1. User logs in → Backend issues JWT & Refresh Token
2. Access Token stored in HttpOnly Cookie
3. Frontend sends requests with `withCredentials`
4. Token expired → Interceptor calls `/api/refresh`
5. Refresh token validated in Redis → New access token issued
6. Logout → Refresh token revoked

---

## 📌 Project Purpose

This project is built as:

- A **real-world authentication system example**
- A **full-stack portfolio project**
- A foundation for extending English learning features

---

## 📄 License

This project is for **educational and portfolio purposes**.

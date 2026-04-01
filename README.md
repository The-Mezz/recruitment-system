# RecruitPro — Recruitment Management System

A full-stack recruitment platform built with **Spring Boot** (backend) and **React + Vite** (frontend).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database | MariaDB (via XAMPP) |
| Frontend | React 18, Vite, React Router, Axios, Recharts |

## Prerequisites

Make sure you have installed:
- [Java 17+](https://www.oracle.com/java/technologies/downloads/)
- [XAMPP](https://www.apachefriends.org/) (for MariaDB)
- [Node.js 20+](https://nodejs.org/)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/The-Mezz/recruitment-system.git
cd recruitment-system
```

### 2. Start the Database
- Open **XAMPP Control Panel**
- Start **MySQL** (MariaDB on port 3306)
- The database `recruitment_management` will be created automatically

### 3. Start the Backend
```bash
# Windows
cmd /c "java -Dmaven.multiModuleProjectDirectory=. -classpath .mvn\wrapper\maven-wrapper.jar org.apache.maven.wrapper.MavenWrapperMain spring-boot:run"
```
Backend runs on → **http://localhost:8080**

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on → **http://localhost:5173**

## Default Roles

Register a new account and choose your role:
- **CANDIDATE** — Browse jobs, apply, track applications, upload documents
- **RECRUITER** — Post jobs, manage applications, schedule interviews
- **ADMIN** — Manage all users and the platform

## API Documentation
Swagger UI available at: **http://localhost:8080/swagger-ui.html**

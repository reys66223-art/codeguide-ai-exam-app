# Backend Structure Document

This document outlines the backend setup for the **codeguide-ai-exam-app**, an online exam and practice platform for schools. It explains the architecture, database details, APIs, hosting, infrastructure, security, and maintenance in clear, everyday language.

## 1. Backend Architecture

- **Framework & Design Pattern**
  - Built on **Next.js** using the App Router, which supports both server-side and client-side components.
  - Organizes code into clear folders (`/app`, `/api`, `/db`, `/lib`), following a modular, feature-driven pattern.
- **Core Technologies**
  - **TypeScript** for type safety across backend logic.
  - **Next.js API Routes** to implement RESTful endpoints.
  - **Drizzle ORM** to interact with the database in a type-safe way.
- **Scalability & Performance**
  - Server components render dashboard views on the server to reduce client load and speed up initial page loads.
  - Client components handle interactive parts (student exam interfaces) for a responsive experience.
  - Horizontal scaling is possible by running multiple Next.js instances behind a load balancer.
- **Maintainability**
  - Modular directory structure lets developers find and update related code quickly.
  - Type-safe ORM and clear API boundaries reduce bugs and make refactoring easier.

## 2. Database Management

- **Technology**
  - **Type**: Relational (SQL)
  - **System**: **PostgreSQL**
- **ORM**
  - **Drizzle ORM** to define models, handle migrations, and run queries with TypeScript support.
- **Data Practices**
  - All critical entities (Teachers, Students, Exams, Questions, Submissions) stored in strongly related tables.
  - Use of migrations to track schema changes and keep development/staging/production databases in sync.
  - Connection pooling to manage database load and improve performance.

## 3. Database Schema

Below is a human-readable description followed by the SQL schema for PostgreSQL.

### Human-Readable Schema

- **Teachers**: Stores teacher accounts and credentials.
- **Students**: Stores student profiles and their relationship to specific exams.
- **Exams**: Records exam details like title, timer settings, and the unique exam code.
- **Questions**: Holds each question tied to an exam, including type (MCQ or essay), options, correct answer, and model essay answer.
- **Submissions**: Captures student answers, timestamps, and essay scoring metadata.

### SQL Schema (PostgreSQL)
```sql
-- Teachers table
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW()
);

-- Exams table
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  exam_code VARCHAR(10) UNIQUE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,            -- 'mcq' or 'essay'
  prompt TEXT NOT NULL,
  options JSONB,                         -- for MCQ: list of choices
  correct_option VARCHAR(50),           -- for MCQ: key of correct choice
  model_answer TEXT,                    -- for essay questions
  points INTEGER DEFAULT 1
);

-- Submissions table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,               -- student answers keyed by question ID
  essay_scores JSONB,                   -- received from Gemini AI
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

## 4. API Design and Endpoints

- **Approach**: RESTful API built with Next.js API Routes.
- **Key Endpoints**:
  - **Authentication**
    - `POST /api/auth/teacher/login`: Teacher sign-in
    - `POST /api/auth/student/login`: Student exam code login
  - **Exam Management** (Teacher only)
    - `GET /api/exams`: List all exams
    - `POST /api/exams`: Create a new exam
    - `PUT /api/exams/:id`: Update exam settings
    - `DELETE /api/exams/:id`: Remove an exam
  - **Question Management**
    - `GET /api/exams/:examId/questions`
    - `POST /api/exams/:examId/questions`
    - `PUT /api/questions/:id`
    - `DELETE /api/questions/:id`
  - **Student Flows**
    - `GET /api/exams/:examCode`: Validate and retrieve exam details
    - `POST /api/exams/:examId/submit`: Submit student answers
  - **Essay Scoring**
    - `POST /api/grade-essay`: Sends essay + model answer to Gemini AI, returns score
  - **Monitoring**
    - `GET /api/exams/:examId/monitor`: Fetch live status snapshots (used with WebSockets for push updates)

## 5. Hosting Solutions

- **Provider**: **Vercel** (recommended)
  - **Benefits**:
    - Seamless Next.js integration with automatic deployments from Git.
    - Built-in CDN for static assets.
    - Automatic SSL certificates for HTTPS.
    - Serverless functions for API routes that scale on demand.
- **Alternative**: Self-hosted on AWS/GCP/Azure with Docker Compose or Kubernetes for finer control.

## 6. Infrastructure Components

- **Load Balancer**
  - Managed by Vercel or implemented via a cloud provider to distribute traffic across instances.
- **Caching**
  - Use HTTP cache headers for static assets (leveraged by Vercel’s global CDN).
  - Optionally, a Redis cache for frequent read operations (e.g., exam templates).
- **WebSockets**
  - Powered by **Socket.io** or a third-party real-time service (Pusher, Ably) for live monitoring updates.
- **Containerization**
  - **Docker & Docker Compose** define local development and CI environments to match production.

## 7. Security Measures

- **Authentication & Authorization**
  - **Better Auth** for teacher accounts, extended with OAuth (Google).
  - Custom login based on unique exam codes for students.
  - Protect all teacher-only routes with middleware that checks for valid sessions.
- **Data Encryption**
  - TLS/HTTPS for all in-transit data.
  - Environment variables (API keys, DB credentials) never exposed in code.
- **Input Validation & Sanitization**
  - Validate request bodies with libraries like `zod` before processing.
  - Escape or strip harmful characters to prevent SQL injection or XSS.
- **Secrets Management**
  - Store Gemini AI keys and database passwords in a secure vault or Vercel Environment Variables.

## 8. Monitoring and Maintenance

- **Logging & Alerts**
  - Use Vercel’s built-in logs and error tracking for API routes.
  - Integrate a tool like **Sentry** for runtime error monitoring.
- **Performance Monitoring**
  - Vercel Analytics for page-load metrics.
  - Database slow-query logs in PostgreSQL.
- **Maintenance Practices**
  - Scheduled database backups and automated migrations via Drizzle.
  - Regular dependency updates and security audits.
  - Defined process for rolling back deployments in case of issues.

## 9. Conclusion and Overall Backend Summary

The backend for **codeguide-ai-exam-app** is built on a modern, type-safe stack that ensures reliability, scalability, and a clear separation of concerns. Key highlights:

- A Next.js-based architecture combining server and client components for optimal performance.
- PostgreSQL with Drizzle ORM delivers robust data integrity and type safety.
- Secure, RESTful API routes manage authentication, exam workflows, and AI grading.
- Vercel hosting with Docker-powered local environments guarantees consistent development and seamless deployment.
- Real-time monitoring, caching strategies, and strict security practices protect user data and enhance the exam experience.

This setup provides a solid foundation for further extensions—like advanced analytics, richer AI integrations, and custom reporting—while remaining easy to understand and maintain for any developer or stakeholder.
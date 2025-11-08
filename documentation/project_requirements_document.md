# Project Requirements Document (PRD)

## 1. Project Overview

The **Online Exam & Practice App for Schools** is a web-based platform that lets teachers create, manage, and monitor exams, while students can take those exams and receive instant feedback. It addresses the challenge of manual exam preparation, distribution, and grading by providing a fully integrated system where instructors define questions (multiple-choice and essays), set timers, and track student progress in real time. At the same time, students log in with a unique exam code, complete tests online, and get automatic scoring for objective questions plus AI-powered grading for essays.

We’re building this app to streamline the exam workflow in educational institutions, reducing administrative overhead and speeding up the grading process. Our main success criteria are: teacher adoption (ease of creating and administering exams), student satisfaction (smooth, reliable test-taking experience), secure handling of user data, and accurate essay scoring using an AI model. Performance, security, and reliability are equally critical since exams are time-sensitive and often high-stakes.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- Teacher authentication (OAuth or school credentials) and student login via exam code
- Teacher Dashboard: create/edit/delete exams, add questions, set timers, register students, generate codes
- Student Exam Interface: enter code, view questions sequentially, track time, submit answers
- Multiple-choice auto-grading and AI-driven essay scoring via the Gemini AI API
- Real-time monitoring of student activity (login status, question submissions, time remaining) using WebSockets
- Data persistence in PostgreSQL via Drizzle ORM
- Responsive UI built with Next.js, React, Tailwind CSS, and the shadcn/ui component library
- Containerized development environment using Docker & Docker Compose
- Basic testing setup: unit tests (Jest/Vitest), integration tests (React Testing Library), end-to-end tests (Cypress)

**Out-of-Scope (Later Phases):**
- Native mobile apps (iOS/Android)
- Advanced proctoring (video monitoring, AI-based cheating detection)
- Payment gateway or subscription management
- Detailed analytics dashboards beyond basic results reporting
- Multilingual or accessibility enhancements beyond basic responsive design
- Offline exam-taking support or desktop clients
- Integration with third-party school information systems (SIS)

## 3. User Flow

A **teacher** visits the sign-in page and logs in with their school credentials or Google account. Upon authentication, they land on the Dashboard, which shows an overview of existing exams and student registrations. From there, they click “Create Exam,” fill out form fields (title, date/time, timer settings), add questions (multiple-choice options or essay prompts with a model answer), and register students by uploading a list or entering emails manually. When ready, the teacher publishes the exam, generating a unique code for each student.

A **student** opens the exam link or app, enters the provided exam code on the login screen, and types their name. After verifying their registration, they join the test environment. Questions appear one at a time with a visible countdown timer. Students select answers for multiple-choice or type essays in text areas. Progress and time are auto-saved periodically. When the exam ends (timer hits zero or student submits early), they see a confirmation page. Multiple-choice responses are instantly graded and displayed; essay answers are queued for AI scoring, and results are shown when available.

## 4. Core Features

- **Role-Based Authentication**: Separate login flows for teachers (OAuth or school credentials) and students (exam code + name).
- **Teacher Dashboard**: Exam CRUD (create, read, update, delete), student registration, code generation.
- **Exam Creation**: Support for multiple-choice questions and essay questions with model answers.
- **Timer Management**: Configurable countdown timer per exam, auto-submit on timeout.
- **Answer Submission**: Auto-save answers, final submission endpoint.
- **Automatic Grading**: Multiple-choice auto-scoring; server-side API calls to Gemini AI for essay evaluation.
- **Real-Time Monitoring**: WebSocket-based updates on student status, answer submissions, and connection health.
- **Database Layer**: PostgreSQL schema with tables for Users (teachers), Students, Exams, Questions, Submissions; Drizzle ORM for type-safe queries.
- **Containerized Dev**: Docker and Docker Compose setup for local development and testing.
- **Testing Suite**: Unit, integration, and end-to-end tests covering business logic and UI flows.

## 5. Tech Stack & Tools

- **Frontend**:
  - Next.js (App Router) with React
  - TypeScript for type safety
  - Tailwind CSS for styling
  - shadcn/ui component library
  - State management (Zustand or Jotai) for client-side exam state
- **Backend**:
  - Next.js API Routes for server endpoints
  - Better Auth (or next-auth) for teacher authentication
  - Custom student login endpoint (`/api/exam-login`)
  - PostgreSQL database
  - Drizzle ORM for schema definition and queries
  - Gemini AI API integration for essay scoring (`lib/gemini.ts`)
- **Real-Time**:
  - Socket.io (or Pusher/Ably) for WebSocket streams
- **Dev & Deployment**:
  - Docker & Docker Compose
  - Vercel for production hosting
  - Environment variables for API keys and database credentials
- **IDE & Tools**:
  - VS Code with Windsurf and Cursor extensions for AI-assisted coding
  - Testing: Jest/Vitest, React Testing Library, Cypress/Playwright

## 6. Non-Functional Requirements

- **Performance**: Page loads under 2s on average; API responses under 500ms for core endpoints.
- **Scalability**: Support up to 1,000 concurrent users per exam session without degradation.
- **Security**: OWASP Top 10 best practices, HTTPS enforced, JWT or session cookies, input validation, CORS configured.
- **Reliability**: 99.9% uptime; automatic retries for transient errors.
- **Usability**: Responsive UI, clear error messages, keyboard accessibility for exam navigation.
- **Compliance**: GDPR-friendly data handling (student information), secure storage of PII.

## 7. Constraints & Assumptions

- **Constraints**:
  - Dependence on Gemini AI API availability and rate limits.
  - Must run within the Next.js App Router architecture.
  - All configuration via environment variables; no secrets in client bundle.
- **Assumptions**:
  - Schools have reliable internet access during exam windows.
  - Teachers will have Google accounts or school credentials set up.
  - Student data volumes are moderate (thousands, not millions).
  - Initial deployment on Vercel; database hosted separately (e.g., Supabase or AWS RDS).

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits**: Gemini AI may throttle requests. Mitigation: batch essay grading, implement exponential backoff, and cache model answers.
- **Real-Time Latency**: WebSocket delays could mislead teachers. Mitigation: show client timestamps and auto-reconnect logic.
- **Network Interruptions**: Students losing connectivity mid-exam. Mitigation: local auto-save, retry logic, and clear UI indicators.
- **Database Schema Changes**: Extending Drizzle schemas can introduce migration complexity. Mitigation: use automated migration tools and version control for schema.
- **Security Risks**: Exposed API keys or endpoints. Mitigation: enforce server-side only access for AI calls, secure headers, and environment-based secrets.

---

This document lays out all the details an AI or development team needs to build the first version of the Online Exam & Practice App. It covers who does what, how users move through the system, the exact tech stack, and the standards we must meet to deliver a polished, secure solution.
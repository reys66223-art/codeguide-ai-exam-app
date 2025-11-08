# codeguide-ai-exam-app Tech Stack Document

This document explains, in everyday language, why we chose each technology for the **Online Exam & Practice App for Schools**. You don’t need a technical background to understand how each piece fits together.

## 1. Frontend Technologies

These are the tools we use to build everything students and teachers see and interact with in their browser:

- **Next.js (App Router)**
  - A framework built on React that makes page navigation fast and lets us decide whether parts run on the server or in the browser.
  - Helps us deliver exam questions quickly and also update the student’s timer in real time.
- **React**
  - The core library for building the interactive parts of our app (buttons, forms, menus).
- **TypeScript**
  - Adds a safety net around our code by checking for mistakes before we even run the app.
  - Reduces errors in complex data like exam questions and student answers.
- **Tailwind CSS**
  - A utility-first styling tool that speeds up layout and design.
  - Lets us create custom exam interfaces and dashboards without writing a lot of CSS from scratch.
- **shadcn/ui**
  - A collection of pre-built components (tables, dialogs, inputs) that we can customize to match our needs.
  - Speeds up development of forms for creating exams and the student exam interface.
- **Optional State Management (Zustand or Jotai)**
  - For the student exam flow, a lightweight tool to keep track of answers, timer, and navigation between questions.

## 2. Backend Technologies

These technologies power the logic behind the scenes—handling data, saving exams, and running automated scoring:

- **Next.js API Routes**
  - Let us write backend code right alongside our frontend in the same project.
  - We use them for actions like creating exams, submitting answers, and calling external services for scoring.
- **Better Auth**
  - A pre-built authentication system that we extend for teachers (via username/password or Google login) and adapt for students (using unique exam codes).
- **PostgreSQL (Database)**
  - A reliable database that stores all our information: teacher profiles, student lists, exams, questions, and submissions.
- **Drizzle ORM**
  - A tool that translates our in-app data models into database queries, all with TypeScript safety.
  - Ensures we don’t make mistakes when saving or fetching complex relationships.
- **Custom AI Integration (lib/gemini.ts)**
  - A small module dedicated to talking with the Gemini AI API for essay scoring.
  - Keeps our AI code organized and secure on the server side.
- **Real-Time Layer (Socket.io, Pusher, or Ably)**
  - Enables live updates on the teacher’s monitoring dashboard (e.g., student login status, answer submissions).

## 3. Infrastructure and Deployment

How we build, test, and host the application so it’s reliable and easy to update:

- **Docker & Docker Compose**
  - Package the app and its database into containers so everyone—developers and CI systems—runs the same environment.
  - Simplifies local setup: one command brings up the app and database.
- **Vercel**
  - A hosting platform optimized for Next.js.
  - Automatically deploys updates when code is pushed, ensuring fast and reliable releases.
- **Version Control (Git & GitHub)**
  - Keeps track of changes, lets multiple developers work together, and integrates with Vercel for deployments.
- **CI/CD Pipelines (GitHub Actions or Vercel’s built-in)**
  - Automatically run tests and build the app before each deployment, catching errors early.

## 4. Third-Party Integrations

Services that extend our app’s capabilities without us building everything from scratch:

- **Gemini AI API**
  - Automates essay scoring by comparing student responses to model answers provided by teachers.
  - Delivers near-instant feedback and reduces manual grading work.
- **OAuth Providers (e.g., Google)**
  - Allows teachers to log in securely using their existing Google accounts.
- **Real-Time Messaging Services (Pusher, Ably, or Socket.io)**
  - Powers live dashboards so teachers can monitor exams as they happen.

## 5. Security and Performance Considerations

Measures we put in place to keep data safe and ensure a smooth user experience:

- **Authentication & Authorization**
  - All teacher-only routes and APIs are protected, ensuring only authorized users can create or view exams.
- **Environment Variables**
  - API keys (Gemini AI, OAuth) and database credentials are stored securely, never exposed in the browser.
- **Input Validation**
  - Every form and API call checks incoming data to prevent errors and injection attacks.
- **Type Safety (TypeScript & Drizzle ORM)**
  - Catches many errors at compile time, reducing runtime crashes.
- **Performance Optimizations**
  - Server Components in Next.js for data-heavy pages (Teacher Dashboard).
  - Client Components for interactive parts (Student Exam Timer).
  - Tailwind CSS utility classes minimize CSS bundle size.

## 6. Conclusion and Overall Tech Stack Summary

Our chosen technologies work together to meet the goals of an Online Exam & Practice App:

- **Next.js + React + TypeScript** for a fast, interactive, and type-safe user interface.
- **Tailwind CSS + shadcn/ui** for beautiful, customizable design without extra overhead.
- **Better Auth + OAuth** for secure, role-based access.
- **PostgreSQL + Drizzle ORM** for reliable, type-safe data management.
- **Docker & Vercel** for consistent development environments and smooth, automatic deployments.
- **Gemini AI** for automated essay scoring, vastly speeding up feedback.
- **WebSockets or Real-Time Services** for live exam monitoring.

These choices ensure the application is easy to build on, secure by design, and offers both teachers and students a seamless experience.
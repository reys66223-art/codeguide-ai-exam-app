# Frontend Guideline Document

This document outlines the frontend architecture, design principles, and technologies used in the `codeguide-ai-exam-app`. It aims to give a clear, everyday-language overview so that anyone can understand how the frontend is set up, how it scales, and how it supports the app’s goals.

---

## 1. Frontend Architecture

### Frameworks and Libraries
- **Next.js (App Router)**: Provides file-based routing, server components for data-heavy pages (Teacher Dashboard), and client components for interactive parts (Student Exam interface).  
- **React & TypeScript**: Ensures a strongly typed component model and safer code.  
- **shadcn/ui**: A collection of ready-made, customizable React components (tables, forms, dialogs) built on top of Radix UI and styled with Tailwind CSS.  
- **Tailwind CSS**: Utility-first CSS framework for rapid styling and layout.  
- **Zustand**: Lightweight state-management library for client-side exam state (answers, timer, navigation).

### Supporting Scalability, Maintainability, Performance
- **Server vs. Client Components**: Heavy data fetching and rendering happen on the server, reducing client payload and speeding up load times. Interactive, stateful UI lives in client components only where needed.  
- **Modular File Structure**: Pages, components, and styles are organized by feature (e.g., `/app/dashboard/exams`, `/components/ui`), making the codebase easier to navigate and extend.  
- **Type Safety**: TypeScript and Drizzle ORM types help catch errors early, supporting maintainability as the app grows.  
- **Incremental Adoption**: Tailwind and shadcn/ui let you style small parts at a time without full rewrites.

---

## 2. Design Principles

### Usability
- **Clear Workflows**: The Teacher Dashboard and Student Interface use consistent layouts, clear labels, and gradual disclosure of complexity (e.g., step-by-step exam creation forms).  
- **Feedback & Validation**: Input fields show immediate validation messages; loading states and success/failure notifications guide users.

### Accessibility
- **Semantic Markup**: All buttons, forms, and dialogs use proper ARIA roles and landmarks.  
- **Keyboard Navigation**: Focus states are styled, and users can complete exams entirely via keyboard.  
- **Color Contrast**: The palette meets WCAG AA standards for text and background combinations.

### Responsiveness
- **Mobile-First**: Layouts stack vertically on small screens; critical controls (submit, next question) remain easily tappable.  
- **Adaptive Breakpoints**: Tailwind’s breakpoints (`sm`, `md`, `lg`, `xl`) adjust dashboards and question layouts for tablets and desktops.

---

## 3. Styling and Theming

### Styling Approach
- **Utility-First**: Tailwind CSS classes drive most styling, keeping custom CSS to a minimum.  
- **Component Styles**: For unique or complex styles, we follow a BEM-like convention in small CSS or in `@apply` directives inside Tailwind.

### Theming
- **Tailwind Configuration**: Colors, spacing, and fonts are centrally defined in `tailwind.config.js`.  
- **Dark Mode**: Enabled via class strategy (`.dark`), allowing easy toggling if required in the future.

### Visual Style
- **Look & Feel**: Modern flat design with subtle shadows—clean interfaces, no heavy gradients.  
- **Glassmorphism** (Optional Accent): Use sparingly (e.g., modal backdrops) with semi-transparent white and blur.

### Color Palette
- **Primary**: #4F46E5 (Indigo)  
- **Secondary**: #6366F1 (Violet)  
- **Success**: #10B981 (Green)  
- **Warning**: #F59E0B (Amber)  
- **Danger**: #EF4444 (Red)  
- **Neutral Light**: #F3F4F6 (Gray-100)  
- **Neutral Dark**: #111827 (Gray-900)

### Typography
- **Font Family**: `Inter, sans-serif` for a clean, modern appearance.  
- **Base Sizes**: 16px root; headings scale using `text-2xl`, `text-xl`, `text-lg` in Tailwind.

---

## 4. Component Structure

### Organization
- `/app`: Page and route definitions by feature area (e.g., `(auth)`, `dashboard`, `(exam)`).  
- `/components/ui`: Reusable base components (Button, Input, Table, Dialog) derived from shadcn/ui.  
- `/components/features`: Feature-specific components (ExamForm, QuestionCard, TimerDisplay).

### Reuse and Maintainability
- **Atomic Components**: Small building blocks (e.g., `ui/Button`) are combined into molecules and organisms (e.g., `ExamForm`).  
- **Props and Composition**: Components accept configuration via props, avoid conditional CSS inside, and lean on Tailwind for variants.
- **Folder-by-Feature**: Related files (component, tests, styles) live together, easing updates and refactors.

---

## 5. State Management

### Approach
- **Server State**: Handled transparently by Next.js server components or React Query (if added later).  
- **Client State (Exam Flow)**: Managed with **Zustand** in `/store/examStore.ts`: current question index, answers, timer, marked-for-review flags.

### Sharing State
- **Context Avoidance**: Zustand removes the need for React Context boilerplate; any component can read or write to the store directly.  
- **Persistence**: Optionally sync store to `localStorage` so students don’t lose answers on refresh.

---

## 6. Routing and Navigation

### Library
- Next.js App Router handles all frontend navigation and data loading via file-system based routes.

### Structure
- `/app/(auth)/sign-in`: Teacher login.  
- `/app/(exam)/take/[examCode]`: Student exam interface.  
- `/app/dashboard`: Teacher Portal with nested routes:  
  • `/dashboard/exams`  
  • `/dashboard/exams/create`  
  • `/dashboard/students`  
  • `/dashboard/monitor/[examId]`

### Navigation Patterns
- **Sidebar + Topbar**: Teacher Dashboard uses a persistent sidebar for module links and a topbar for actions.  
- **Wizard-Like Flow**: Exam forms guide users through steps: details → questions → review → publish.

---

## 7. Performance Optimization

- **Code Splitting**: Next.js automatically splits bundles per route. For heavy components (charts, real-time viewers), use `dynamic()` imports.  
- **Lazy Loading**: Load non-critical UI elements (e.g., detailed reports) only when needed.  
- **Image Optimization**: Use `next/image` for exam images or question assets.  
- **Asset Compression**: Tailwind output purging via PurgeCSS, gzip on the server.  
- **Memoization**: Memoize pure components and expensive calculations (e.g., question navigation logic) with `React.memo` and `useMemo`.

---

## 8. Testing and Quality Assurance

### Unit Tests
- **Jest or Vitest**: Test pure functions (score calculations, timer logic).  
- **Mocking**: Mock API calls to isolate component logic.

### Integration Tests
- **React Testing Library**: Verify component interactions—form submission, navigation between questions, error states.

### End-to-End Tests
- **Cypress or Playwright**: Simulate full exam flow for both Teacher and Student: login, create exam, take exam, submit, and view results.

### Linting and Formatting
- **ESLint**: Enforce code style and catch errors.  
- **Prettier**: Automatic code formatting.  
- **Tailwind CSS Linting**: (`stylelint` with `stylelint-config-tailwindcss`) to keep utility classes consistent.

---

## 9. Conclusion and Overall Frontend Summary

This frontend setup combines the power of Next.js, React, and Tailwind CSS with a clear structure and modern design principles. By:
- Splitting server and client concerns,  
- Embracing utility-first styling and a consistent theme,  
- Organizing components by feature,  
- Using a simple yet scalable state store,  
- Optimizing performance and ensuring quality through testing,

we create a reliable, maintainable, and user-friendly application. Whether you’re extending the Teacher Dashboard, building a real-time monitoring view, or polishing the Student Exam interface, these guidelines ensure consistency and speed up development. 
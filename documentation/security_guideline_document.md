# Security Guidelines for `codeguide-ai-exam-app`

## 1. Introduction and Scope
This document defines security best practices and controls tailored to the `codeguide-ai-exam-app`, an online exam and practice platform built with Next.js, TypeScript, Drizzle ORM, and containerized via Docker. It covers all phases: design, development, testing, deployment, and maintenance. Adhering to these guidelines will ensure a robust, resilient, and trustworthy application.

## 2. Core Security Principles
- **Security by Design**: Embed security at every phase, from architecture to production.
- **Least Privilege**: Grant minimal permissions to users, services, and database roles.
- **Defense in Depth**: Layer controls so that compromising one doesn’t compromise all.
- **Fail Securely**: On errors or timeouts, avoid revealing internals; default to safe behavior.
- **Secure Defaults**: All new features should be secure out-of-the-box.

---

## 3. Authentication & Access Control
### 3.1 Teacher & Student Flows
- **Teacher Authentication**:
  - Use **Better Auth** or **NextAuth** with OAuth (e.g., Google) and strong credential storage.
  - Enforce multi-factor authentication (MFA) for teacher accounts.
- **Student Authentication**:
  - Issue time-limited, single-use exam codes.
  - Validate codes server-side against an allow-list in PostgreSQL.

### 3.2 Password Policies & Session Management
- Store passwords using **bcrypt** or **Argon2** with unique salts.
- Generate cryptographically secure, unpredictable session IDs.
- Set session cookies with `HttpOnly`, `Secure`, and `SameSite=Strict`.
- Enforce idle and absolute session timeouts; provide logout endpoints.
- Protect against session fixation by rotating session IDs on login.

### 3.3 Role-Based Access Control (RBAC)
- Define distinct roles: `Teacher`, `Student`, `Admin`, etc.
- Enforce server-side authorization for every protected route/API.
- Validate JWTs if used: check `alg`, signature, `exp`, `iss`, and `aud`.
- Apply the principle of least privilege in API handlers and database queries.

---

## 4. Input Handling and Processing
- **Server-Side Validation**: Duplicate all client-side checks on the server.
- **Prevent Injection**:
  - Use Drizzle ORM’s parameterized queries—never string-concatenate SQL.
  - Validate and sanitize all form fields (`examCode`, free-text answers, etc.).
- **XSS Mitigation**:
  - Output-encode any user-supplied content (e.g., essay previews).
  - Use a strong **Content Security Policy (CSP)**.
- **Restrict Redirects**:
  - Whitelist internal URLs only.
- **File Uploads** (if any):
  - Validate MIME types, scan for malware, store outside webroot.

---

## 5. Data Protection and Privacy
- **Encryption in Transit**: Enforce HTTPS/TLS 1.2+ via HSTS and redirect HTTP to HTTPS.
- **Encryption at Rest**:
  - Encrypt database volumes (e.g., AWS RDS encryption).
  - Secure any stored PII with field-level encryption if required.
- **Secrets Management**:
  - Store API keys (e.g., Gemini AI) in a vault or environment variables; do not hardcode.
  - Rotate secrets periodically.
- **Data Minimization**:
  - Only collect and store necessary fields (e.g., student names, answers).
- **Logging & Monitoring**:
  - Mask or redact PII in logs.
  - Centralize logs in a secure, write-only store.

---

## 6. API & Service Security
- **HTTPS Everywhere**: All API routes must reject non-TLS requests.
- **Rate Limiting & Throttling**:
  - Limit login attempts and exam-code submissions to mitigate brute-force.
- **CORS Policy**:
  - Restrict origins to allowed front-end domains.
- **HTTP Methods**:
  - Use GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals.
- **Minimal Response Data**:
  - Return only needed fields; avoid exposing internal IDs or debug flags.

---

## 7. Web Application Security Hygiene
- **Anti-CSRF**:
  - Protect state-changing endpoints with synchronizer tokens.
- **Security Headers**:
  - `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.
- **Secure Cookies**: Already set in Session Management.
- **Clickjacking Protection**: Enforce via CSP or `X-Frame-Options`.
- **Subresource Integrity (SRI)**: When loading third-party scripts/CSS.

---

## 8. Infrastructure & Configuration Management
- **Server Hardening**:
  - Disable unused services, default accounts, and ports on containers/VMs.
- **TLS Configuration**:
  - Use strong ciphers; disable SSLv3, TLS 1.0/1.1.
- **Environment Segregation**:
  - Separate dev, staging, and prod networks.
- **Disable Debugging in Prod**:
  - No stack traces or verbose logs exposed to end users.

---

## 9. Dependency Management
- **Lockfiles**:
  - Commit `package-lock.json` or `yarn.lock` for deterministic builds.
- **Vulnerability Scanning**:
  - Integrate SCA tools (e.g., Dependabot, Snyk) in CI.
- **Minimal Footprint**:
  - Only include essential libraries (e.g., Drizzle, shadcn/ui).

---

## 10. Testing, Monitoring, and Incident Response
- **Automated Tests**:
  - Unit tests (Jest/Vitest) for business logic.
  - Integration tests for API routes (React Testing Library).
  - E2E tests (Cypress/Playwright) for full exam flows.
- **Security Testing**:
  - Regular dependency vulnerability scans.
  - Periodic penetration tests / code reviews.
- **Monitoring & Alerts**:
  - Track unusual patterns (e.g., high failed logins).
  - Maintain an incident response plan with clear roles and communication channels.

---

## 11. Additional Recommendations
- **Real-Time WebSockets**:
  - Authenticate each socket connection; validate tokens.
  - Rate-limit events to prevent flooding.
- **Gemini AI Integration**:
  - Encapsulate AI calls in a single server module (`lib/gemini.ts`).
  - Validate and sanitize prompts and responses.
  - Handle API timeouts and retries gracefully.

**By following these guidelines, `codeguide-ai-exam-app` will maintain a strong security posture throughout its lifecycle, safeguarding user data and ensuring trustworthy operations.**
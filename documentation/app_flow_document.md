# codeguide-ai-exam-app App Flow Document

## Onboarding and Sign-In/Sign-Up

When a new user first visits the application, they land on a clean welcome page that offers two clear paths: Teacher Access or Student Access. A teacher clicks the “Teacher Sign In” button and is taken to a unified sign-in and sign-up page where they can choose to register with an email and password or leverage a Google OAuth option. During registration, the teacher provides an email address, creates a secure password, and receives a confirmation link by email before they can proceed. If they ever forget their password, they can click the “Forgot Password” link, enter their registered email, and follow a secure link from their inbox to reset it. Once they verify their account or reset their password, they return to the Teacher Sign In page, enter their credentials or authenticate with Google, and are granted access.

A student who already has an exam code clicks the “Student Login” button on the landing page and is directed to a simple exam code entry form. They supply the unique code provided by their teacher along with their full name. The system validates the code against the active exams database; if it is valid, the student proceeds directly into their exam session without creating a permanent account. Any incorrect or expired codes prompt an on-screen message explaining the issue and offering a chance to try again.

## Main Dashboard or Home Page

After a successful teacher login, the application presents the Teacher Dashboard, which occupies the full browser view. A vertical sidebar on the left lists main sections: Exams, Students, Monitoring, Results, and Settings. Along the top of the page is a header displaying the teacher’s name, a notification icon, and a sign-out button. In the main panel, the default view is a summary of upcoming and recent exams, shown as cards with titles, scheduled dates, and status indicators. From this screen, teachers can click into any of the sidebar sections to manage specific tasks.

When a student enters a valid exam code, they skip any dashboard and arrive at the Exam Start page. This page shows the exam title, total time allotted, and a Start Exam button. Once they click that button, they begin the timed session and enter the interactive exam interface.

## Detailed Feature Flows and Page Transitions

Within the Teacher Dashboard, selecting the Exams section brings up a list of all created exams. Each exam entry displays its name, code, and status with an Edit button. Clicking the Edit button transitions to a dedicated exam editor page where teachers can modify exam details such as title, instructions, timer settings, and question types. From the editor, they add questions one by one using a form that supports multiple-choice and essay fields, complete with answer keys and model responses. Submitting this form sends the data to a secured API endpoint, which persists the details to the database and regenerates the exam code if necessary. After submission, the app navigates back to the Exams list with a success banner confirming the update.

The Students section lists registered participants for each exam. Teachers can click an Add Students button, fill out a form to upload student names or invite them by email, and then return to the list view. Every action here leads to a table view that refreshes to show new entries immediately.

In the Monitoring section, teachers select a live exam from a dropdown of active sessions. The monitoring page presents a grid of student avatars or names alongside status indicators like “In Progress,” “Completed,” or “Disconnected.” This page opens a WebSocket connection so that any student activity—question answered, time remaining, reconnection—updates instantly on the teacher’s screen. If a network error occurs server-side, the teacher sees a discrete banner explaining the temporary issue and the view attempts to reconnect automatically.

Once an exam concludes, the Results section provides a consolidated summary. Teachers can choose an exam from a list and then review class performance charts, individual scores for multiple-choice questions, and AI-scored essay grades. Clicking into an individual result shows the student’s answers side by side with correct answers and the AI’s feedback on essay responses.

From the student side, after pressing Start Exam, they enter a full-screen interface that shows one question at a time. A persistent timer at the top counts down from the exam’s total duration. Navigation arrows and a question map let students jump between questions in any order. Their answers save automatically as they type or select an option. If they click the Submit button or time runs out, a confirmation dialog appears. Confirming submission sends all answers to the server via a protected API route, triggers essay grading through the Gemini AI endpoint, and then moves the student to a final page displaying their scored results and any feedback.

## Settings and Account Management

Teachers access their personal settings by clicking on their name in the top header and choosing Settings. This page allows them to update profile details such as display name, email address, and password. If they change their email, the system sends a re-verification link. Teachers can also configure notification preferences here, opting in or out of real-time alerts for student events. A Save Changes button commits all updates to the database and displays a confirmation message before returning to the Dashboard.

Students have no persistent account settings since their exam sessions are temporary. After finishing an exam, they can close the browser or return to the landing page to start a different exam if they have a new code.

## Error States and Alternate Paths

If a teacher enters invalid credentials at sign in, an inline error message appears beneath the login form, prompting them to try again. Forgotten passwords follow a recovery flow that sends a secure link and shows feedback at each step. Should the email service fail, a clear error banner instructs the teacher to retry or contact support. During exam creation or editing, if required fields are missing or invalid data is entered, form-level validation messages highlight issues directly next to the offending field.

For students, entering an unrecognized or expired exam code immediately shows a red error message and a chance to re-enter the code. If network connectivity drops while they are working on the exam, a non-blocking banner warns them that answers are not being saved, and the system attempts to reconnect in the background. In the rare case of a server error when submitting, the student sees a page explaining the error and can click Retry to resend their answers. If the AI grading endpoint fails, the submission still completes and the teacher is notified to grade the essays manually.

## Conclusion and Overall App Journey

From start to finish, a teacher signs up or logs in, configures and publishes an exam, registers students, and then watches live progress before reviewing results. A student sees only the relevant exam code entry screen, enters the session, answers questions within a timed environment, and receives immediate feedback. Throughout both journeys, the interface guides users step by step, handles any errors gracefully, and ensures data flows securely between the front end, the Next.js API, the PostgreSQL database, and the Gemini AI scoring service. This seamless flow supports the primary goal of running reliable, interactive online exams with minimal friction for both teachers and students.
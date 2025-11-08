# Database Setup and Schema Documentation

## Overview

This database schema supports a comprehensive online examination system with AI integration for essay grading. The schema is designed to handle multiple stakeholders (teachers, students) and complex exam workflows with real-time monitoring capabilities.

## Database Tables

### Core Tables

#### `students`
Stores student registration and authentication information.
- **id**: UUID primary key
- **name**: Student's full name
- **nisn**: Unique student identification number (Indonesian National Student ID)
- **dateOfBirth**: Student's date of birth for verification
- **password**: Hashed password for authentication
- **createdAt/updatedAt**: Timestamps for record management

#### `teachers`
Extends the user authentication system with teacher-specific data.
- **id**: UUID primary key
- **userId**: Foreign key to the authentication user table
- **schoolName**: Name of the school/institution
- **teacherId**: School-assigned teacher identifier

#### `exams`
Central exam configuration and metadata.
- **id**: UUID primary key
- **teacherId**: Foreign key to the teacher who created the exam
- **title**: Exam title/name
- **description**: Detailed exam description
- **duration**: Exam duration in minutes
- **displayMode**: How questions are displayed (`one_by_one` or `all_at_once`)
- **examCode**: Unique 6-character code for student access
- **status**: Exam lifecycle status (`draft`, `active`, `ended`)
- **isActive**: Boolean flag for active exams
- **startTime/endTime**: Exam availability window

#### `questions`
Stores individual exam questions with support for multiple question types.
- **id**: UUID primary key
- **examId**: Foreign key to the parent exam
- **type**: Question type (`multiple_choice` or `essay`)
- **content**: Question text/content
- **options**: JSON array of options for multiple-choice questions
- **correctAnswer**: The correct option for multiple-choice questions
- **modelAnswer**: Expected answer for essay questions (used by AI grading)
- **points**: Point value for the question
- **order**: Display order within the exam

### Session and Tracking Tables

#### `exam_sessions`
Tracks individual student exam sessions with real-time status.
- **id**: UUID primary key
- **examId/studentId**: Foreign keys to exam and student
- **startTime**: When the student began the exam
- **endTime**: When the student completed or timed out
- **status**: Current session state
- **currentQuestion**: Current question number for `one_by_one` mode
- **timeRemaining**: Remaining time in seconds
- **lastActivity**: Last student activity timestamp
- **ipAddress/userAgent**: Session metadata for monitoring

#### `submissions`
Stores final exam answers and grading results.
- **id**: UUID primary key
- **examId/studentId/sessionId**: Foreign keys
- **answers**: JSON object of all student answers
- **multipleChoiceScore**: Score from automatically graded questions
- **essayScore**: Score from AI-graded essay questions
- **totalScore**: Combined score
- **maxScore**: Maximum possible score
- **aiFeedback**: Detailed AI feedback for essay responses
- **submittedAt**: Submission timestamp
- **gradedAt**: When the submission was graded

#### `question_activity`
Granular tracking of student interactions with each question.
- **id**: UUID primary key
- **sessionId/questionId**: Foreign keys
- **startTime/endTime**: Time spent on the question
- **timeSpent**: Total time in seconds
- **attempts**: Number of answer attempts
- **isMarkedForReview**: Student marked question for review

## Database Relationships

```
teachers (1) ←→ (N) exams (1) ←→ (N) questions
    ↓                    ↓
   user               (1) ←→ (N) exam_sessions ←→ (1) students
                            ↓                    ↓
                         (1) ←→ (N) submissions ←→ (1) questions
                            ↓
                         (1) ←→ (N) question_activity ←→ (1) questions
```

## Enums and Constraints

### Enums
- `exam_display_mode`: `one_by_one`, `all_at_once`
- `question_type`: `multiple_choice`, `essay`
- `exam_session_status`: `not_started`, `in_progress`, `completed`, `submitted`, `expired`
- `exam_status`: `draft`, `active`, `ended`

### Constraints
- Unique constraints on student NISN, teacher user ID, and exam codes
- Foreign key constraints with cascade deletion for data integrity
- Non-null constraints on critical fields
- Check constraints for valid ranges (duration, points, etc.)

## Performance Optimizations

### Indexes
- Primary key indexes on all UUID fields
- Unique indexes on identification fields (nisn, exam_code, user_id)
- Composite indexes for common query patterns
- Foreign key indexes for join performance

### Query Patterns
- Exam lookup by code for student login
- Session tracking by exam and student
- Question ordering within exams
- Submission analysis by exam

## Migration Management

### Running Migrations
```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Reset database (development only)
npm run db:reset
```

### Seed Data
```bash
# Populate database with sample data
npm run db:seed
```

## Database Setup

### Prerequisites
- PostgreSQL 13+
- Node.js environment
- Environment variables configured

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

### Connection Pool
- Maximum 20 concurrent connections
- 30-second idle timeout
- 2-second connection timeout
- SSL enabled for production environments

## Data Validation

### Business Rules
- Exam duration: 5-480 minutes
- Questions per exam: No hard limit
- Multiple choice options: 4-5 options
- Essay model answers: Required for essay questions
- Student NISN: Must be unique, max 20 characters
- Exam codes: Auto-generated 6-character unique codes

### Security Considerations
- Passwords should be hashed before storage
- IP addresses logged for audit trails
- Session tracking for academic integrity
- Time-based access controls through exam windows

## AI Integration Points

### Essay Grading
- `questions.modelAnswer`: Reference for AI evaluation
- `submissions.aiFeedback`: Detailed AI scoring and feedback
- `submissions.essayScore`: AI-calculated essay scores

### Monitoring Features
- Real-time session status tracking
- Question-level activity monitoring
- Time-based analytics and reporting

## Usage Examples

### Creating a New Exam
```typescript
const exam = await createExam({
  title: "Mathematics Final Exam",
  duration: 90,
  displayMode: "one_by_one",
  teacherId: teacher.id
});
```

### Student Exam Access
```typescript
const exam = await getExamByCode(examCode);
const session = await createExamSession({
  examId: exam.id,
  studentId: student.id
});
```

### Grading Submissions
```typescript
const submission = await createSubmission({
  examId: exam.id,
  studentId: student.id,
  sessionId: session.id,
  answers: studentAnswers,
  maxScore: totalPoints
});
```

## Maintenance

### Regular Tasks
- Monitor connection pool usage
- Archive old exam data
- Update statistics and indexes
- Review and optimize slow queries

### Backup Strategy
- Regular database dumps
- Point-in-time recovery capability
- Migration rollback procedures